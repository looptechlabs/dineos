// ============================================================================
// DineOS - Invoices API Client (Frontend)
// ============================================================================
// Frontend API client that calls Next.js API routes (BFF pattern)
// ============================================================================

import { getAccessToken, handleTokenRefresh } from "./auth";

export interface Order {
    id: number;
    itemName: string;
    quantity: number;
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface Invoice {
    id: number;
    tableNumber: number;
    orders: Order[];
    totalAmount: number;
    status: 'PAID' | 'UNPAID';
}

export interface CreateInvoiceData {
    tableNumber: string;
    diningOptionId?: number;
    subtotal: number;
    productDiscount?: number;
    extraDiscount?: number;
    couponDiscount?: number;
    total: number;
}

/**
 * Fetch invoice for a specific table
 * @param tenantSlug - The tenant's slug (subdomain)
 * @param tableId - Optional table ID to filter by
 * @returns Invoice object or null
 */
export async function fetchInvoices(tenantSlug: string, tableId?: string): Promise<Invoice | null> {
    try {
        let token = getAccessToken(tenantSlug);
        console.log(`[fetchInvoices] Fetching invoices for tenant: ${tenantSlug}${tableId ? `, table: ${tableId}` : ''}`);

        if (!token) {
            throw new Error('No authentication token found. Please login again.');
        }

        // Call Next.js API proxy route
        let apiUrl = `/api/invoices?tenantSlug=${encodeURIComponent(tenantSlug)}&token=${encodeURIComponent(token)}`;
        
        // Add table ID if provided
        if (tableId) {
            apiUrl += `&tableId=${encodeURIComponent(tableId)}`;
        }

        let response = await fetch(apiUrl, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Handle 401 - try refreshing token
        if (response.status === 401) {
            console.log('[fetchInvoices] Got 401, attempting token refresh...');
            const newToken = await handleTokenRefresh(tenantSlug);
            if (newToken) {
                token = newToken;
                let retryUrl = `/api/invoices?tenantSlug=${encodeURIComponent(tenantSlug)}&token=${encodeURIComponent(token)}`;
                if (tableId) {
                    retryUrl += `&tableId=${encodeURIComponent(tableId)}`;
                }
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
            throw new Error(result.message || 'Failed to fetch invoices');
        }

        return result.data;
    } catch (error) {
        console.error('Error fetching invoices:', error);
        throw error;
    }
}

/**
 * Create a new invoice for a specific tenant
 * @param tenantSlug - The tenant's slug (subdomain)
 * @param invoiceData - The invoice data to create
 * @returns The created invoice
 */
export async function createInvoice(
    tenantSlug: string,
    invoiceData: CreateInvoiceData
): Promise<Invoice> {
    try {
        let token = getAccessToken(tenantSlug);
        console.log(`[createInvoice] Creating invoice for tenant: ${tenantSlug}`);

        if (!token) {
            throw new Error('No authentication token found. Please login again.');
        }

        const makeRequest = async (authToken: string) => {
            return await fetch('/api/invoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tenantSlug,
                    token: authToken,
                    invoiceData,
                }),
            });
        };

        let response = await makeRequest(token);

        // Handle 401 - try refreshing token
        if (response.status === 401) {
            console.log('[createInvoice] Got 401, attempting token refresh...');
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
            throw new Error(result.message || 'Failed to create invoice');
        }

        return result.data;
    } catch (error) {
        console.error('Error creating invoice:', error);
        throw error;
    }
}
