// ============================================================================
// DineOS - Middleware (Subdomain Routing)
// ============================================================================
// This middleware handles subdomain-based routing for the multi-tenant system:
// - dineos.localhost:3000/admin/* -> Superadmin panel
// - app.dineos.localhost:3000/* -> Tenant dashboard (authenticated tenant owners)
// - www.dineos.localhost:3000/* -> Marketing/landing pages
// - [tenant].dineos.localhost:3000/* -> Customer-facing menu for specific tenant
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// Configuration
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'dineos.localhost:3000';
const RESERVED_SUBDOMAINS = ['www', 'app', 'api', 'admin', 'static', 'assets', 'cdn', 'mail'];

/**
 * Extract subdomain from hostname
 * Examples:
 * - "burgerhouse.dineos.localhost:3000" -> "burgerhouse"
 * - "app.dineos.localhost:3000" -> "app"
 * - "dineos.localhost:3000" -> null (root domain)
 * - "www.dineos.localhost:3000" -> "www"
 */
function getSubdomain(hostname: string): string | null {
  // Remove port if present
  const host = hostname.split(':')[0];
  
  // Get the root domain without port
  const rootDomainWithoutPort = ROOT_DOMAIN.split(':')[0];
  
  // Check if this is the root domain
  if (host === rootDomainWithoutPort) {
    return null;
  }
  
  // Check if hostname ends with the root domain
  if (!host.endsWith(`.${rootDomainWithoutPort}`)) {
    return null;
  }
  
  // Extract subdomain
  const subdomain = host.replace(`.${rootDomainWithoutPort}`, '');
  
  // Handle multi-level subdomains (take only the first part)
  return subdomain.split('.')[0] || null;
}

/**
 * Check if subdomain is reserved (system subdomains)
 */
function isReservedSubdomain(subdomain: string | null): boolean {
  if (!subdomain) return false;
  return RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase());
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const subdomain = getSubdomain(hostname);
  const pathname = url.pathname;
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] Host: ${hostname}, Subdomain: ${subdomain}, Path: ${pathname}`);
  }
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  // =========================================================================
  // ROUTE 1: Root domain admin routes (dineos.localhost:3000/admin/*)
  // Superadmin panel - no rewrite needed, direct routing
  // =========================================================================
  if (!subdomain && pathname.startsWith('/admin')) {
    const response = NextResponse.next();
    response.headers.set('x-tenant-id', '');
    response.headers.set('x-is-superadmin', 'true');
    return response;
  }

  // =========================================================================
  // ROUTE 2: Root domain without subdomain (dineos.localhost:3000)
  // Redirect to marketing site or show landing page
  // =========================================================================
  if (!subdomain) {
    // For root domain, rewrite to marketing pages
    url.pathname = `/home${pathname === '/' ? '' : pathname}`;
    const response = NextResponse.rewrite(url);
    response.headers.set('x-tenant-id', '');
    return response;
  }

  // =========================================================================
  // ROUTE 3: App subdomain (app.dineos.localhost:3000)
  // Tenant dashboard for restaurant owners to manage their restaurant
  // =========================================================================
  if (subdomain === 'app') {
    url.pathname = `/app${pathname === '/' ? '' : pathname}`;
    const response = NextResponse.rewrite(url);
    response.headers.set('x-tenant-id', '');
    response.headers.set('x-is-app-dashboard', 'true');
    return response;
  }

  // =========================================================================
  // ROUTE 4: WWW subdomain (www.dineos.localhost:3000)
  // Marketing/landing pages
  // =========================================================================
  if (subdomain === 'www') {
    url.pathname = `/home${pathname === '/' ? '' : pathname}`;
    const response = NextResponse.rewrite(url);
    response.headers.set('x-tenant-id', '');
    return response;
  }

  // =========================================================================
  // ROUTE 5: Other reserved subdomains
  // Return 404 or handle specifically
  // =========================================================================
  if (isReservedSubdomain(subdomain)) {
    return NextResponse.next();
  }

  // =========================================================================
  // ROUTE 6: Tenant subdomain ([tenant].dineos.localhost:3000)
  // Customer-facing menu and ordering experience
  // =========================================================================
  // This is a tenant subdomain (e.g., burgerhouse.dineos.localhost:3000)
  // Rewrite to /site/[tenant] and pass tenant info via headers
  url.pathname = `/site/${subdomain}${pathname === '/' ? '' : pathname}`;
  
  const response = NextResponse.rewrite(url);
  
  // Pass tenant identifier via header for API calls
  response.headers.set('x-tenant-id', subdomain);
  response.headers.set('x-tenant-slug', subdomain);
  
  return response;
}

export const config = {
  // Match all paths except static files
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
