// ============================================================================
// DineOS - Menus API Client (Frontend)
// ============================================================================
// Frontend API client that calls Next.js API routes (BFF pattern)
// Follows the same pattern as tenant-login
// ============================================================================
import { getAccessToken, handleTokenRefresh } from "./auth";

export interface Menu {
  id?: number;
  name: string;
  description: string;
  isActive: boolean;
}

/**
 * Fetch all menus for a specific tenant
 * @param tenantSlug - The tenant's slug (subdomain)
 * @returns Array of menus
 */
export async function fetchMenus(tenantSlug: string): Promise<Menu[]> {
  try {
    let token = getAccessToken(tenantSlug);
    console.log(`[fetchMenus] Fetching menus for tenant: ${tenantSlug}`);
    console.log(`[fetchMenus] Token: ${token ? token.substring(0, 20) + '...' : 'No token found'}`);
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    
    // Call Next.js API proxy route
    const apiUrl = `/api/menus?tenantSlug=${encodeURIComponent(tenantSlug)}&token=${encodeURIComponent(token)}`;
    
    let response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Handle 401 - try refreshing token
    if (response.status === 401) {
      console.log('[fetchMenus] Got 401, attempting token refresh...');
      const newToken = await handleTokenRefresh(tenantSlug);
      if (newToken) {
        token = newToken;
        const retryUrl = `/api/menus?tenantSlug=${encodeURIComponent(tenantSlug)}&token=${encodeURIComponent(token)}`;
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
      throw new Error(result.message || 'Failed to fetch menus');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching menus:', error);
    throw error;
  }
}

/**
 * Create a new menu for a specific tenant
 * @param tenantSlug - The tenant's slug (subdomain)
 * @param menuData - The menu data to create
 * @returns The created menu
 */
export async function createMenu(
  tenantSlug: string, 
  menuData: Omit<Menu, 'id'>
): Promise<Menu> {
  try {
    let token = getAccessToken(tenantSlug);
    console.log(`[createMenu] Creating menu for tenant: ${tenantSlug}`);
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    
    const makeRequest = async (authToken: string) => {
      // Call Next.js API proxy route
      return await fetch('/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantSlug,
          token: authToken,
          menuData,
        }),
      });
    };
    
    let response = await makeRequest(token);
    
    // Handle 401 - try refreshing token
    if (response.status === 401) {
      console.log('[createMenu] Got 401, attempting token refresh...');
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
      throw new Error(result.message || 'Failed to create menu');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating menu:', error);
    throw error;
  }
}

/**
 * Update an existing menu (PATCH)
 * @param tenantSlug - The tenant's slug (subdomain)
 * @param menuId - The menu ID to update
 * @param menuData - The updated menu data
 * @returns The updated menu
 */
export async function updateMenu(
  tenantSlug: string,
  menuId: number,
  menuData: Partial<Menu>
): Promise<Menu> {
  try {
    let token = getAccessToken(tenantSlug);
    console.log(`[updateMenu] Updating menu ${menuId} for tenant: ${tenantSlug}`);
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    
    const makeRequest = async (authToken: string) => {
      // Call Next.js API proxy route
      return await fetch(`/api/menus/${menuId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantSlug,
          token: authToken,
          menuData,
        }),
      });
    };
    
    let response = await makeRequest(token);
    
    // Handle 401 - try refreshing token
    if (response.status === 401) {
      console.log('[updateMenu] Got 401, attempting token refresh...');
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
      throw new Error(result.message || 'Failed to update menu');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating menu:', error);
    throw error;
  }
}

/**
 * Delete a menu
 * @param tenantSlug - The tenant's slug (subdomain)
 * @param menuId - The menu ID to delete
 */
export async function deleteMenu(
  tenantSlug: string,
  menuId: number
): Promise<void> {
  try {
    let token = getAccessToken(tenantSlug);
    console.log(`[deleteMenu] Deleting menu ${menuId} for tenant: ${tenantSlug}`);
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    
    const makeRequest = async (authToken: string) => {
      // Call Next.js API proxy route
      return await fetch(`/api/menus/${menuId}`, {
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
    
    // Handle 401 - try refreshing token
    if (response.status === 401) {
      console.log('[deleteMenu] Got 401, attempting token refresh...');
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
      throw new Error(result.message || 'Failed to delete menu');
    }
  } catch (error) {
    console.error('Error deleting menu:', error);
    throw error;
  }
}
