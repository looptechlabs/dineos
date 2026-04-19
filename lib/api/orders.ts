// ============================================================================
// DineOS - Orders API Client (Frontend)
// ============================================================================
// Frontend API client that calls Next.js API routes (BFF pattern)
// ============================================================================

import { getAccessToken, handleTokenRefresh } from "./auth";

export interface POSOrder {
    id?: number;
    invoiceId: number;
    itemId: number;
    itemName?: string;
    quantity: number;
    unitPrice?: number;
    totalPrice?: number;
    notes?: string;
    tableNumber: string;
    status?: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
    createdAt?: string;
}

export interface CreateOrderData {
    invoiceId: number;
    itemId: number;
    quantity: number;
    notes?: string;
    tableNumber: string;
}

/**
 * Fetch all orders for a specific tenant
 * @param tenantSlug - The tenant's slug (subdomain)
 * @returns Array of orders
 */
export async function fetchOrders(tenantSlug: string): Promise<POSOrder[]> {
    try {
        let token = getAccessToken(tenantSlug);
        console.log(`[fetchOrders] Fetching orders for tenant: ${tenantSlug}`);

        if (!token) {
            throw new Error('No authentication token found. Please login again.');
        }

        // Call Next.js API proxy route
        const apiUrl = `/api/orders?tenantSlug=${encodeURIComponent(tenantSlug)}&token=${encodeURIComponent(token)}`;

        let response = await fetch(apiUrl, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Handle 401 - try refreshing token
        if (response.status === 401) {
            console.log('[fetchOrders] Got 401, attempting token refresh...');
            const newToken = await handleTokenRefresh(tenantSlug);
            if (newToken) {
                token = newToken;
                const retryUrl = `/api/orders?tenantSlug=${encodeURIComponent(tenantSlug)}&token=${encodeURIComponent(token)}`;
                response = await fetch(retryUrl, {
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                throw new Error('Session expired. Please login again.');
            }
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch orders');
        }

        return result.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

/**
 * Create a new order for a specific tenant
 * @param tenantSlug - The tenant's slug (subdomain)
 * @param orderData - The order data to create
 * @returns The created order
 */
export async function createOrder(
    tenantSlug: string,
    orderData: CreateOrderData
): Promise<POSOrder> {
    try {
        let token = getAccessToken(tenantSlug);
        console.log(`[createOrder] Creating order for tenant: ${tenantSlug}`);

        if (!token) {
            throw new Error('No authentication token found. Please login again.');
        }

        const makeRequest = async (authToken: string) => {
            return await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tenantSlug,
                    token: authToken,
                    orderData,
                }),
            });
        };

        let response = await makeRequest(token);

        // Handle 401 - try refreshing token
        if (response.status === 401) {
            console.log('[createOrder] Got 401, attempting token refresh...');
            const newToken = await handleTokenRefresh(tenantSlug);
            if (newToken) {
                token = newToken;
                response = await makeRequest(token);
            } else {
                throw new Error('Session expired. Please login again.');
            }
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to create order');
        }

        return result.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

/**
 * Update order status
 * @param tenantSlug - The tenant's slug (subdomain)
 * @param orderId - The order ID
 * @param status - New status
 * @returns The updated order
 */
export async function updateOrderStatus(
    tenantSlug: string,
    orderId: number,
    status: POSOrder['status']
): Promise<POSOrder> {
    try {
        let token = getAccessToken(tenantSlug);
        console.log(`[updateOrderStatus] Updating order ${orderId} for tenant: ${tenantSlug}`);

        if (!token) {
            throw new Error('No authentication token found. Please login again.');
        }

        const makeRequest = async (authToken: string) => {
            return await fetch('/api/orders', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tenantSlug,
                    token: authToken,
                    orderId,
                    status,
                }),
            });
        };

        let response = await makeRequest(token);

        // Handle 401 - try refreshing token
        if (response.status === 401) {
            console.log('[updateOrderStatus] Got 401, attempting token refresh...');
            const newToken = await handleTokenRefresh(tenantSlug);
            if (newToken) {
                token = newToken;
                response = await makeRequest(token);
            } else {
                throw new Error('Session expired. Please login again.');
            }
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to update order');
        }

        return result.data;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
}
