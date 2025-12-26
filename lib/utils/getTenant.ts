import { checkTenantExists } from "./checkTenant";

export async function getTenantSlug(): Promise<string> {
  try {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    console.log('[getTenantSlug] Full hostname:', hostname);
    
    const parts = hostname.split('.');
    console.log('[getTenantSlug] Hostname parts:', parts);
    
    // Handle different URL patterns:
    // - pizzahut.menuly.localhost (3 parts)
    // - pizzahut.localhost (2 parts)
    // - localhost (1 part - no tenant)
    if (parts.length < 2) {
      console.warn('[getTenantSlug] No tenant subdomain found in hostname');
      return '';
    }
    
    const slug = parts[0];
    console.log('[getTenantSlug] Extracted slug:', slug);
    
    // Skip if slug is a reserved subdomain
    const reserved = ['www', 'app', 'api', 'admin', 'localhost'];
    if (reserved.includes(slug.toLowerCase())) {
      console.warn('[getTenantSlug] Slug is reserved:', slug);
      return '';
    }
    
    // Optionally, verify tenant existence here if needed
    const exist = await checkTenantExists(slug);
    console.log('[getTenantSlug] Tenant exists:', exist);
    
    if (!exist) {
      return '';
    }
    
    return slug;
  } catch (error) {
    console.error(`[getTenantSlug] Error:`, error);
    return '';
  }
}
