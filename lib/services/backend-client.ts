// ============================================================================
// DineOS - Backend API Client Configuration
// ============================================================================
// Centralized configuration for making requests to the Java backend on AWS
// ============================================================================

/**
 * Get the backend base URL for a specific tenant
 * @param tenantSlug - The tenant's slug (subdomain)
 * @returns Base URL for the backend API
 */
export function getBackendBaseUrl(tenantSlug: string): string {
  return `http://${tenantSlug}.menuly:8080/api/v1`;
}

/**
 * Get standard headers for backend API requests
 * @param token - JWT access token
 * @param tenantSlug - The tenant's slug
 * @returns Headers object
 */
export function getBackendHeaders(token: string, tenantSlug?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // Add tenant header if provided
  if (tenantSlug) {
    headers['x-tenant-id'] = tenantSlug;
  }

  return headers;
}

/**
 * Handle backend API responses and errors
 * @param response - Fetch response object
 * @returns Parsed JSON data
 */
export async function handleBackendResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Backend Client] Error ${response.status}:`, errorText);
    throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  // If no content (e.g., DELETE operations)
  if (response.status === 204 || response.status === 200) {
    return null as T;
  }

  throw new Error('Backend returned non-JSON response');
}
