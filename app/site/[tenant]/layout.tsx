// ============================================================================
// DineOS - Tenant Site Layout
// ============================================================================
// Routes: [tenant].dineos.localhost:3000/* 
// Simple layout that just renders children - tenant validation happens client-side
// ============================================================================

import type { Metadata } from 'next';

interface SiteLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    tenant: string;
  }>;
}

// Generate dynamic metadata based on tenant slug
export async function generateMetadata({ params }: SiteLayoutProps): Promise<Metadata> {
  const { tenant: tenantSlug } = await params;

  return {
    title: `${tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1)} | DineOS`,
    description: `Restaurant management for ${tenantSlug}`,
  };
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  // Just render children - tenant validation happens in client components
  return <>{children}</>;
}
