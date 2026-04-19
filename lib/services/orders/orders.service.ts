// ============================================================================
// DineOS - Orders Backend Service
// ============================================================================
// Server-side service for order operations with the Java backend
// Used by Next.js API routes only
// ============================================================================

import { getBackendBaseUrl, getBackendHeaders, handleBackendResponse } from '../backend-client';

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

export interface CreateOrderRequest {
    invoiceId: number;
    itemId: number;
    quantity: number;
    notes?: string;
    tableNumber: string;
}

export interface TableOrdersResponse{
    [tableNumber: string] : {
        additionalNotes: string;
    amount: number;
    id: number;
    itemId: number;
    quantity: number;
    status: string;
    tableNumber: number;
    }[];
}
/**
 * Create a new order on backend
 * @param tenantSlug - The tenant's slug
 * @param orderData - The order data
 * @param token - JWT access token
 * @returns Created order
 */
export async function createOrderOnBackend(
    tenantSlug: string,
    orderData: CreateOrderRequest,
    token: string
): Promise<POSOrder> {
    const backendUrl = `${getBackendBaseUrl(tenantSlug)}/orders`;

    console.log(`[Orders Service] Creating order on: ${backendUrl} with orderData:`, orderData);

    const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
            ...getBackendHeaders(token, tenantSlug),
            'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk',
        },
        body: JSON.stringify(orderData),
    });

    return handleBackendResponse<POSOrder>(response);
}

/**
 * Fetch all orders from backend
 * @param tenantSlug - The tenant's slug
 * @param token - JWT access token
 * @returns Array of orders
 */
export async function fetchOrdersFromBackend(
    tenantSlug: string,
    token: string
): Promise<POSOrder[]> {
    const backendUrl = `${getBackendBaseUrl(tenantSlug)}/orders`;

    console.log(`[Orders Service] Fetching orders from: ${backendUrl}`);

    const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
            ...getBackendHeaders(token, tenantSlug),
            'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk',
        },
        cache: 'no-store',
    });

    return handleBackendResponse<POSOrder[]>(response);
}

/**
 * Update order status on backend
 * @param tenantSlug - The tenant's slug
 * @param orderId - The order ID
 * @param status - New status
 * @param token - JWT access token
 * @returns Updated order
 */
export async function updateOrderStatusOnBackend(
    tenantSlug: string,
    orderId: number,
    status: POSOrder['status'],
    token: string
): Promise<POSOrder> {
    const backendUrl = `${getBackendBaseUrl(tenantSlug)}/orders/${orderId}`;

    console.log(`[Orders Service] Updating order ${orderId} status on: ${backendUrl}`);

    const response = await fetch(backendUrl, {
        method: 'PATCH',
        headers: {
            ...getBackendHeaders(token, tenantSlug),
            'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk',
        },
        body: JSON.stringify({ status }),
    });

    return handleBackendResponse<POSOrder>(response);
}


export async function fetchOrdersBasedOnTable(
    tenantSlug: string,
    token: string,
): Promise<TableOrdersResponse> {

   const backendUrl = `${getBackendBaseUrl(tenantSlug)}/orders`;

    console.log(`[Orders Service] All orders based on table number from: ${backendUrl}`);

        const response = await fetch(backendUrl, {
            method: "GET",
            headers:{
            'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk',
            'Content-Type': 'application/json',
        }
    });

    return handleBackendResponse<TableOrdersResponse>(response);

    }
 
