// ============================================================================
// DineOS - Items Backend Service
// ============================================================================
// Server-side service for item operations with the Java backend
// Used by Next.js API routes only
// ============================================================================

import { getBackendBaseUrl, getBackendHeaders, handleBackendResponse } from './backend-client';

export interface Item {
  id?: number;
  menu_id: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  type: 'VEGETARIAN' | 'NON_VEGETARIAN' | 'VEGAN';
}

/**
 * Fetch all items for a menu from backend
 * @param tenantSlug - The tenant's slug
 * @param menuId - The menu ID
 * @param token - JWT access token
 * @returns Array of items
 */
export async function fetchItemsFromBackend(
  tenantSlug: string,
  menuId: number,
  token: string
): Promise<Item[]> {
  const backendUrl = `${getBackendBaseUrl(tenantSlug)}/items?menuId=${menuId}`;
  
  console.log(`[Items Service] Fetching items from: ${backendUrl}`);
  
  const response = await fetch(backendUrl, {
    method: 'GET',
    headers: {
      ...getBackendHeaders(token, tenantSlug),
      'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk',
    },
    cache: 'no-store',
  });
  
  return handleBackendResponse<Item[]>(response);
}

/**
 * Create a new item on backend
 * @param tenantSlug - The tenant's slug
 * @param itemData - The item data
 * @param token - JWT access token
 * @returns Created item
 */
export async function createItemOnBackend(
  tenantSlug: string,
  itemData: Omit<Item, 'id'>,
  token: string
): Promise<Item> {
  const backendUrl = `${getBackendBaseUrl(tenantSlug)}/items`;
  
  console.log(`[Items Service] Creating item on: ${backendUrl}`);
  
  const response = await fetch(backendUrl, {
    method: 'POST',
    headers: {
      ...getBackendHeaders(token, tenantSlug),
      'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk',
    },
    body: JSON.stringify(itemData),
  });
  
  return handleBackendResponse<Item>(response);
}

/**
 * Update an existing item on backend
 * @param tenantSlug - The tenant's slug
 * @param itemId - The item ID
 * @param itemData - The updated item data
 * @param token - JWT access token
 * @returns Updated item
 */
export async function updateItemOnBackend(
  tenantSlug: string,
  itemId: number,
  itemData: Partial<Item>,
  token: string
): Promise<Item> {
  const backendUrl = `${getBackendBaseUrl(tenantSlug)}/items/${itemId}`;
  
  console.log(`[Items Service] Updating item ${itemId} on: ${backendUrl}`);
  
  const response = await fetch(backendUrl, {
    method: 'PATCH',
    headers: {
      ...getBackendHeaders(token, tenantSlug),
      'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk',
    },
    body: JSON.stringify(itemData),
  });
  
  return handleBackendResponse<Item>(response);
}

/**
 * Delete an item on backend
 * @param tenantSlug - The tenant's slug
 * @param itemId - The item ID
 * @param token - JWT access token
 */
export async function deleteItemOnBackend(
  tenantSlug: string,
  itemId: number,
  token: string
): Promise<void> {
  const backendUrl = `${getBackendBaseUrl(tenantSlug)}/items/${itemId}`;
  
  console.log(`[Items Service] Deleting item ${itemId} on: ${backendUrl}`);
  
  const response = await fetch(backendUrl, {
    method: 'DELETE',
    headers: {
      ...getBackendHeaders(token, tenantSlug),
      'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk',
    },
  });
  
  return handleBackendResponse<void>(response);
}
