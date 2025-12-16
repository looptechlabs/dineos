// ============================================================================
// DineOS - Server-side Tenant Utilities
// ============================================================================
// Utilities for fetching and validating tenant data in Server Components
// ============================================================================

import { headers } from 'next/headers';
import type { Tenant } from '@/lib/types';

// ============================================================================
// Server-side Tenant Extraction
// ============================================================================

/**
 * Get tenant slug from request headers (set by middleware)
 * For use in Server Components
 */
export async function getTenantSlugFromHeaders(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get('x-tenant-slug') || headersList.get('x-tenant-id') || null;
}

/**
 * Check if current request is from superadmin context
 */
export async function isSuperadminRequest(): Promise<boolean> {
  const headersList = await headers();
  return headersList.get('x-is-superadmin') === 'true';
}

/**
 * Check if current request is from app dashboard context
 */
export async function isAppDashboardRequest(): Promise<boolean> {
  const headersList = await headers();
  return headersList.get('x-is-app-dashboard') === 'true';
}

// ============================================================================
// Tenant Data Fetching
// ============================================================================

export interface TenantFetchResult {
  tenant: Tenant | null;
  error: string | null;
  notFound: boolean;
  suspended: boolean;
}



/**
 * Check if tenant exists by calling backend API
 * Simple check: if API returns 200, tenant exists
 * For use in Server Components during layout/page rendering
 */
export async function fetchTenantBySlug(slug: string): Promise<TenantFetchResult> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://52.63.95.108:8080/api';
    console.log(`[fetchTenantBySlug] Checking if tenant exists: ${slug}`);
    
    // Call backend API to check if tenant exists
    const existsUrl = `${apiBaseUrl}/tenants/exists?slug=${slug}`;
    console.log(`[fetchTenantBySlug] Calling: ${existsUrl}`);
    
    const response = await fetch(existsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    console.log(`[fetchTenantBySlug] Response status: ${response.status}`);
    
    // If status is 200, tenant exists
    if (response.status === 200) {
      console.log(`[fetchTenantBySlug] Tenant exists!`);
      return {
        tenant: {
          id: slug,
          slug: slug,
          name: slug,
          ownerEmail: '',
          status: 'active',
          settings: {
            currency: 'NPR',
            timezone: 'Asia/Kathmandu',
            language: 'en',
            orderingEnabled: true,
            reservationsEnabled: false,
            deliveryEnabled: false,
            taxRate: 13,
          },
          branding: {
            primaryColor: '#6366F1',
            secondaryColor: '#1F2937',
            accentColor: '#F59E0B',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        error: null,
        notFound: false,
        suspended: false,
      };
    }

    // Tenant doesn't exist
    console.log(`[fetchTenantBySlug] Tenant not found`);
    return {
      tenant: null,
      error: 'Restaurant doesn\'t exist',
      notFound: true,
      suspended: false,
    };
  } catch (error) {
    console.error('[fetchTenantBySlug] Error:', error);
    return {
      tenant: null,
      error: 'Failed to check restaurant',
      notFound: true,
      suspended: false,
    };
  }
}

/**
 * Fetch tenant data using the slug from headers
 * Combines header extraction and API call
 */
export async function fetchCurrentTenant(): Promise<TenantFetchResult> {
  const slug = await getTenantSlugFromHeaders();

  if (!slug) {
    return {
      tenant: null,
      error: 'No tenant specified',
      notFound: true,
      suspended: false,
    };
  }

  return fetchTenantBySlug(slug);
}

// ============================================================================
// Tenant Validation
// ============================================================================

/**
 * Validate that a tenant exists and is active
 * Returns true if valid, throws/returns false otherwise
 */
export async function validateTenant(slug: string): Promise<boolean> {
  const result = await fetchTenantBySlug(slug);
  return result.tenant !== null && result.tenant.status === 'active';
}

/**
 * Get tenant or throw error (for pages that require tenant)
 */
export async function requireTenant(): Promise<Tenant> {
  const result = await fetchCurrentTenant();

  if (result.notFound) {
    throw new Error('TENANT_NOT_FOUND');
  }

  if (result.suspended) {
    throw new Error('TENANT_SUSPENDED');
  }

  if (!result.tenant) {
    throw new Error(result.error || 'Unknown tenant error');
  }

  return result.tenant;
}
