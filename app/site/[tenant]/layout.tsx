// ============================================================================
// DineOS - Customer Site Layout (Tenant Subdomain)
// ============================================================================
// Routes: [tenant].dineos.localhost:3000/* (e.g., burgerhouse.dineos.localhost:3000)
// This is the customer-facing menu and ordering experience
// ============================================================================

import { notFound } from 'next/navigation';
import { fetchTenantBySlug } from '@/lib/server/tenant';
import { TenantProvider } from '@/context/TenantContext';
import type { Metadata } from 'next';

interface SiteLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    tenant: string;
  }>;
}

// Generate dynamic metadata based on tenant
export async function generateMetadata({ params }: SiteLayoutProps): Promise<Metadata> {
  const { tenant: tenantSlug } = await params;
  const { tenant } = await fetchTenantBySlug(tenantSlug);

  if (!tenant) {
    return {
      title: 'Restaurant Not Found',
    };
  }

  return {
    title: `${tenant.name} | Menu`,
    description: `Order delicious food from ${tenant.name}`,
  };
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { tenant: tenantSlug } = await params;
  
  // Fetch tenant data server-side
  const { tenant, error, notFound: tenantNotFound, suspended } = await fetchTenantBySlug(tenantSlug);

  // Handle tenant not found
  if (tenantNotFound || !tenant) {
    notFound();
  }

  // Handle suspended tenant
  if (suspended) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Restaurant Unavailable
          </h1>
          <p className="text-gray-600">
            This restaurant is currently unavailable. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Extract branding for CSS variables
  const { branding } = tenant;

  return (
    <TenantProvider tenant={tenant} tenantSlug={tenantSlug}>
      <div
        className="min-h-screen"
        style={{
          '--tenant-primary': branding.primaryColor,
          '--tenant-secondary': branding.secondaryColor,
          '--tenant-accent': branding.accentColor,
        } as React.CSSProperties}
      >
        {/* Header */}
        <header 
          className="sticky top-0 z-50 shadow-md"
          style={{ backgroundColor: branding.primaryColor }}
        >
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo / Name */}
              <div className="flex items-center space-x-3">
                {branding.logoUrl ? (
                  <img 
                    src={branding.logoUrl} 
                    alt={tenant.name} 
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: branding.secondaryColor }}
                  >
                    {tenant.name.charAt(0)}
                  </div>
                )}
                <h1 className="text-xl font-bold text-white">
                  {tenant.name}
                </h1>
              </div>

              {/* Cart Button */}
              <button className="relative p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <span className="text-white text-xl">🛒</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-20">
          {children}
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Powered by</p>
              <p className="font-semibold text-gray-800 dark:text-white">DineOS</p>
            </div>
            <button 
              className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg"
              style={{ backgroundColor: branding.primaryColor }}
            >
              View Cart (NPR 0)
            </button>
          </div>
        </footer>
      </div>
    </TenantProvider>
  );
}
