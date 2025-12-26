// ============================================================================
// DineOS - Token Management Utilities
// ============================================================================
// Utilities for handling JWT tokens in Next.js API routes
// ============================================================================

import { NextRequest } from 'next/server';

/**
 * Extract tenant slug from request body
 * This follows the existing pattern used in tenant-login route
 * @param body - Parsed request body
 * @returns Tenant slug or null
 */
export function getTenantFromBody(body: any): string | null {
  return body?.tenantSlug || null;
}

/**
 * Validate that a token exists and is not empty
 * @param token - Token to validate
 * @returns true if valid, false otherwise
 */
export function isValidToken(token: string | null | undefined): token is string {
  return typeof token === 'string' && token.length > 0;
}
