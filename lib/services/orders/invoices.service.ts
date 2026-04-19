// ============================================================================
// DineOS - Invoices Backend Service
// ============================================================================
// Server-side service for invoice operations with the Java backend
// Used by Next.js API routes only
// ============================================================================

import { getBackendBaseUrl, getBackendHeaders, handleBackendResponse } from '../backend-client';

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

export interface CreateInvoiceRequest {
  tableNumber: string;
  diningOptionId?: number;
  subtotal: number;
  productDiscount?: number;
  extraDiscount?: number;
  couponDiscount?: number;
  total: number;
}

/**
 * Create a new invoice on backend
 * @param tenantSlug - The tenant's slug
 * @param invoiceData - The invoice data
 * @param token - JWT access token
 * @returns Created invoice
 */
export async function createInvoiceOnBackend(
  tenantSlug: string,
  invoiceData: CreateInvoiceRequest,
  token: string
): Promise<Invoice> {
  const backendUrl = `${getBackendBaseUrl(tenantSlug)}/invoices`;
  
  console.log(`[Invoices Service] Creating invoice on: ${backendUrl}`);
  
  const response = await fetch(backendUrl, {
    method: 'POST',
    headers: {
      ...getBackendHeaders(token, tenantSlug),
      'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk',
    },
    body: JSON.stringify(invoiceData),
  });
  
  return handleBackendResponse<Invoice>(response);
}

/**
 * Fetch all invoices from backend
 * @param tenantSlug - The tenant's slug
 * @param token - JWT access token
 * @param tableId - Optional table ID to filter by
 * @returns Invoice object or null
 */
export async function fetchInvoicesFromBackend(
  tenantSlug: string,
  token: string,
  tableId?: string
): Promise<Invoice | null> {
  let backendUrl = `${getBackendBaseUrl(tenantSlug)}/invoices`;
  
  // Add table ID as query parameter if provided
  if (tableId) {
    backendUrl += `?tableId=${tableId}`;
  }
  
  console.log(`[Invoices Service] Fetching invoices from: ${backendUrl}`);
  
  const response = await fetch(backendUrl, {
    method: 'GET',
    headers: {
      ...getBackendHeaders(token, tenantSlug),
      'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk',
    },
    cache: 'no-store',
  });
  
  return handleBackendResponse<Invoice | null>(response);
}
