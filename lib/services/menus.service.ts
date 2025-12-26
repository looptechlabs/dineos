// ============================================================================
// DineOS - Menus Backend Service
// ============================================================================
// Server-side service for menu operations with the Java backend
// Used by Next.js API routes only
// ============================================================================

import { getBackendBaseUrl, getBackendHeaders, handleBackendResponse } from './backend-client';

export interface Menu {
  id?: number;
  name: string;
  description: string;
  isActive: boolean;
}

/**
 * Fetch all menus from backend
 * @param tenantSlug - The tenant's slug
 * @param token - JWT access token
 * @returns Array of menus
 */
export async function fetchMenusFromBackend(
  tenantSlug: string,
  token: string
): Promise<Menu[]> {
  const backendUrl = `${getBackendBaseUrl(tenantSlug)}/menus`;
  
  console.log(`[Menus Service] Fetching menus from: ${backendUrl}`);
  
  const response = await fetch(backendUrl, {
    method: 'GET',
    headers: getBackendHeaders(token, tenantSlug),
    cache: 'no-store',
  });
  
  return handleBackendResponse<Menu[]>(response);
}

/**
 * Create a new menu on backend
 * @param tenantSlug - The tenant's slug
 * @param menuData - The menu data
 * @param token - JWT access token
 * @returns Created menu
 */
export async function createMenuOnBackend(
  tenantSlug: string,
  menuData: Omit<Menu, 'id'>,
  token: string
): Promise<Menu> {
  const backendUrl = `${getBackendBaseUrl(tenantSlug)}/menus`;
  
  console.log(`[Menus Service] Creating menu on: ${backendUrl}`);
  
  const response = await fetch(backendUrl, {
    method: 'POST',
    headers: getBackendHeaders(token, tenantSlug),
    body: JSON.stringify(menuData),
  });
  
  return handleBackendResponse<Menu>(response);
}

/**
 * Update an existing menu on backend
 * @param tenantSlug - The tenant's slug
 * @param menuId - The menu ID
 * @param menuData - The updated menu data
 * @param token - JWT access token
 * @returns Updated menu
 */
export async function updateMenuOnBackend(
  tenantSlug: string,
  menuId: number,
  menuData: Partial<Menu>,
  token: string
): Promise<Menu> {
  const backendUrl = `${getBackendBaseUrl(tenantSlug)}/menus/${menuId}`;
  
  console.log(`[Menus Service] Updating menu ${menuId} on: ${backendUrl}`);
  
  const response = await fetch(backendUrl, {
    method: 'PATCH',
    headers: getBackendHeaders(token, tenantSlug),
    body: JSON.stringify(menuData),
  });
  
  return handleBackendResponse<Menu>(response);
}

/**
 * Delete a menu on backend
 * @param tenantSlug - The tenant's slug
 * @param menuId - The menu ID
 * @param token - JWT access token
 */
export async function deleteMenuOnBackend(
  tenantSlug: string,
  menuId: number,
  token: string
): Promise<void> {
  const backendUrl = `${getBackendBaseUrl(tenantSlug)}/menus/${menuId}`;
  
  console.log(`[Menus Service] Deleting menu ${menuId} on: ${backendUrl}`);
  
  const response = await fetch(backendUrl, {
    method: 'DELETE',
    headers: getBackendHeaders(token, tenantSlug),
  });
  
  return handleBackendResponse<void>(response);
}
