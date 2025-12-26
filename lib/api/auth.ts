// ============================================================================
// DineOS - Tenant-Based Authentication API Service
// ============================================================================
// Handles login requests to tenant-specific domain via HOSTS file mapping
// Route: http://{tenant}.menuly:8080/api/users/login
// Example: http://pizzahut.menuly:8080/api/users/login
// ============================================================================

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  message?: string;
}

/**
 * Authenticate admin user for a specific tenant
 * Uses Next.js API proxy route to avoid CORS issues
 * @param tenantSlug - The tenant identifier (e.g., 'pizzahut')
 * @param credentials - Email and password
 * @returns Login response with access_token and refresh_token
 */
export async function tenantAdminLogin(
  tenantSlug: string,
  credentials: LoginCredentials
): Promise<LoginResponse> {
  try {
    // Use Next.js API proxy route instead of calling backend directly (avoids CORS)
    const apiUrl = `/api/auth/tenant-login`;
    
    console.log(`[Auth API] Attempting login for ${credentials.email} via proxy`);
    console.log(`[Auth API] Tenant slug: "${tenantSlug}"`);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenantSlug,
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Auth API] Login failed:', data);
      return {
        success: false,
        message: data.message || 'Login failed. Please check your credentials.',
      };
    }

    console.log('[Auth API] Login successful');
    return {
      success: true,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      message: 'Login successful',
    };
  } catch (error) {
    console.error('[Auth API] Network error during login:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
}

/**
 * Store authentication tokens in localStorage
 * @param tenantSlug - The tenant identifier
 * @param accessToken - JWT access token from login response
 * @param refreshToken - JWT refresh token from login response
 */
export function storeAuthTokens(
  tenantSlug: string, 
  accessToken: string, 
  refreshToken: string
): void {
  if (typeof window !== 'undefined') {
    console.log('[Auth] Storing tokens for tenant:', tenantSlug);
    localStorage.setItem(`dineos_access_token_${tenantSlug}`, accessToken);
    localStorage.setItem(`dineos_refresh_token_${tenantSlug}`, refreshToken);
    localStorage.setItem('dineos_auth_tenant', tenantSlug);
    console.log('[Auth] Tokens stored successfully');
  } else {
    console.error('[Auth] Cannot store tokens - window is undefined');
  }
}

/**
 * Retrieve access token from localStorage
 * @param tenantSlug - The tenant identifier
 * @returns JWT access token or null
 */
export function getAccessToken(tenantSlug: string): string | null {
  
  if(localStorage.getItem(`dineos_access_token_${tenantSlug}`)){
    return localStorage.getItem(`dineos_access_token_${tenantSlug}`);
  }
  
  return null;
}

/**
 * Retrieve refresh token from localStorage
 * @param tenantSlug - The tenant identifier
 * @returns JWT refresh token or null
 */
export function getRefreshToken(tenantSlug: string): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(`dineos_refresh_token_${tenantSlug}`);
  }
  return null;
}

/**
 * Remove authentication tokens from localStorage (logout)
 * @param tenantSlug - The tenant identifier
 */
export function clearAuthTokens(tenantSlug: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`dineos_access_token_${tenantSlug}`);
    localStorage.removeItem(`dineos_refresh_token_${tenantSlug}`);
    localStorage.removeItem('dineos_auth_tenant');
  }
}

/**
 * Check if user is authenticated
 * @param tenantSlug - The tenant identifier
 * @returns boolean indicating authentication status
 */
export function isAuthenticated(tenantSlug: string): boolean {
  return getAccessToken(tenantSlug) !== null;
}
/**
 * Handle token refresh when 401 error occurs
 * @param tenantSlug - The tenant's slug
 * @returns New access token or null if refresh failed
 */
export async function handleTokenRefresh(tenantSlug: string): Promise<string | null> {
  const refreshToken = getRefreshToken(tenantSlug);
  
  if (!refreshToken) {
    console.log('[Token Refresh] No refresh token found, redirecting to login');
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.href = `/site/${tenantSlug}/login`;
    }
    return null;
  }

  try {
    const refreshUrl = `http://${tenantSlug}.menuly:8080/api/v1/users/refresh-token`;
    console.log(`[Token Refresh] Attempting to refresh token for tenant: ${tenantSlug}`);
    
    const refreshRes = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk'
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      const newAccessToken = refreshData.access_token || refreshData.accessToken;
      const newRefreshToken = refreshData.refresh_token || refreshData.refreshToken;
      
      if (newAccessToken) {
        console.log('[Token Refresh] Successfully refreshed token');
        if (typeof window !== 'undefined') {
          localStorage.setItem(`dineos_access_token_${tenantSlug}`, newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem(`dineos_refresh_token_${tenantSlug}`, newRefreshToken);
          }
        }
        return newAccessToken;
      }
    } else {
      console.log('[Token Refresh] Refresh token invalid, redirecting to login');
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.href = `/site/${tenantSlug}/login`;
      }
    }
  } catch (error) {
    console.error('[Token Refresh] Error refreshing token:', error);
  }
  
  return null;
}