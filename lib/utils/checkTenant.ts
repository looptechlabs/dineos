

/**
 * Check if a tenant exists by slug
 * Uses Next.js API route to avoid CORS issues
 * @param slug - The tenant slug (e.g., "looptech")
 * @returns true if tenant exists (200 status), false otherwise
 */
export async function checkTenantExists(slug: string): Promise<boolean> {
  try {
    // Use Next.js API route instead of calling backend directly (avoids CORS)
    const url = `/api/tenants/exists?slug=${slug}`;
    console.log(`[checkTenantExists] Checking tenant: ${slug}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk'
      },
    });
    
    console.log(`[checkTenantExists] Response status: ${response.status}`);
    
    const exists = response.status === 200;
    console.log(`[checkTenantExists] Tenant "${slug}" exists: ${exists}`);
    
    return exists;
  } catch (error) {
    console.error(`[checkTenantExists] Error checking tenant "${slug}":`, error);
    return false;
  }
}
