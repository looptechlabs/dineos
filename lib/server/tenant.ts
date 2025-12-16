// ============================================================================
// DineOS - Server-side Tenant Utilities
// ============================================================================
// Utilities for fetching and validating tenant data in Server Components
// ============================================================================

import { headers } from 'next/headers';
import { createTenantApiClient } from '@/lib/api-client';
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
 * Fetch tenant data by slug from the API
 * For use in Server Components during layout/page rendering
 */
export async function fetchTenantBySlug(slug: string): Promise<TenantFetchResult> {
  try {
    const apiClient = createTenantApiClient(slug);
    const response = await apiClient.tenant.getBySlug(slug);

    if (!response.success || !response.data) {
      return {
        tenant: null,
        error: response.error?.message || 'Tenant not found',
        notFound: true,
        suspended: false,
      };
    }

    const tenant = response.data;

    // Check tenant status
    if (tenant.status === 'suspended') {
      return {
        tenant,
        error: 'This restaurant is currently suspended',
        notFound: false,
        suspended: true,
      };
    }

    if (tenant.status === 'inactive') {
      return {
        tenant: null,
        error: 'This restaurant is currently inactive',
        notFound: true,
        suspended: false,
      };
    }

    return {
      tenant,
      error: null,
      notFound: false,
      suspended: false,
    };
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return {
      tenant: null,
      error: 'Failed to load restaurant information',
      notFound: false,
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
