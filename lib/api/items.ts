// ============================================================================
// DineOS - Items API Client (Frontend)
// ============================================================================
// Frontend API client that calls Next.js API routes (BFF pattern)
// Follows the same pattern as tenant-login
// ============================================================================

import { getAccessToken, handleTokenRefresh } from "./auth";

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
 * Fetch all items for a specific menu
 * @param tenantSlug - The tenant's slug (subdomain)
 * @param menuId - The menu ID
 * @returns Array of items
 */
export async function fetchItems(tenantSlug: string, menuId: number): Promise<Item[]> {
  try {
    let token = getAccessToken(tenantSlug);
    console.log(`[fetchItems] Fetching items for menu ${menuId}, tenant: ${tenantSlug}`);
    console.log(`[fetchItems] Token: ${token ? token.substring(0, 20) + '...' : 'No token found'}`);
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    
    // Call Next.js API proxy route
    const apiUrl = `/api/items?tenantSlug=${encodeURIComponent(tenantSlug)}&token=${encodeURIComponent(token)}&menuId=${menuId}`;
    
    let response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Handle 401 - Token expired
    if (response.status === 401) {
      console.log('[fetchItems] Token expired, attempting refresh');
      const newToken = await handleTokenRefresh(tenantSlug);
      
      if (newToken) {
        console.log('[fetchItems] Retrying with new token');
        token = newToken;
        const retryUrl = `/api/items?tenantSlug=${encodeURIComponent(tenantSlug)}&token=${encodeURIComponent(token)}&menuId=${menuId}`;
        response = await fetch(retryUrl, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        throw new Error('Session expired. Please log in again.');
      }
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch items');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}

/**
 * Create a new item for a specific menu
 * @param tenantSlug - The tenant's slug (subdomain)
 * @param itemData - The item data to create
 * @returns The created item
 */
export async function createItem(
  tenantSlug: string, 
  itemData: Omit<Item, 'id'>
): Promise<Item> {
  try {
    let token = getAccessToken(tenantSlug);
    console.log(`[createItem] Creating item for tenant: ${tenantSlug}`);
    console.log(`[createItem] Item Data:`, itemData);
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    
    const makeRequest = (authToken: string) => {
      // Call Next.js API proxy route
      return fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantSlug,
          token: authToken,
          itemData,
        }),
      });
    };
    
    let response = await makeRequest(token);
    
    // Handle 401 - Token expired
    if (response.status === 401) {
      console.log('[createItem] Token expired, attempting refresh');
      const newToken = await handleTokenRefresh(tenantSlug);
      
      if (newToken) {
        console.log('[createItem] Retrying with new token');
        response = await makeRequest(newToken);
      } else {
        throw new Error('Session expired. Please log in again.');
      }
    }
    
    console.log(`[createItem] Response Status: ${response.status} ${response.statusText}`);
    
    const result = await response.json();
    console.log(`[createItem] Response:`, result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to create item');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
}

/**
 * Update an existing item (PATCH)
 * @param tenantSlug - The tenant's slug (subdomain)
 * @param itemId - The item ID to update
 * @param itemData - The updated item data
 * @returns The updated item
 */
export async function updateItem(
  tenantSlug: string,
  itemId: number,
  itemData: Partial<Item>
): Promise<Item> {
  try {
    let token = getAccessToken(tenantSlug);
    console.log(`[updateItem] Updating item ${itemId} for tenant: ${tenantSlug}`);
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    
    const makeRequest = (authToken: string) => {
      // Call Next.js API proxy route
      return fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantSlug,
          token: authToken,
          itemData,
        }),
      });
    };
    
    let response = await makeRequest(token);
    
    // Handle 401 - Token expired
    if (response.status === 401) {
      console.log('[updateItem] Token expired, attempting refresh');
      const newToken = await handleTokenRefresh(tenantSlug);
      
      if (newToken) {
        console.log('[updateItem] Retrying with new token');
        response = await makeRequest(newToken);
      } else {
        throw new Error('Session expired. Please log in again.');
      }
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to update item');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
}

/**
 * Delete an item
 * @param tenantSlug - The tenant's slug (subdomain)
 * @param itemId - The item ID to delete
 */
export async function deleteItem(
  tenantSlug: string,
  itemId: number
): Promise<void> {
  try {
    let token = getAccessToken(tenantSlug);
    console.log(`[deleteItem] Deleting item ${itemId} for tenant: ${tenantSlug}`);
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    
    const makeRequest = (authToken: string) => {
      // Call Next.js API proxy route
      return fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantSlug,
          token: authToken,
        }),
      });
    };
    
    let response = await makeRequest(token);
    
    // Handle 401 - Token expired
    if (response.status === 401) {
      console.log('[deleteItem] Token expired, attempting refresh');
      const newToken = await handleTokenRefresh(tenantSlug);
      
      if (newToken) {
        console.log('[deleteItem] Retrying with new token');
        response = await makeRequest(newToken);
      } else {
        throw new Error('Session expired. Please log in again.');
      }
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete item');
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}
