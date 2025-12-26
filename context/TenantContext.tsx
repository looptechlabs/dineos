// ============================================================================
// DineOS - Tenant Context Provider
// ============================================================================
// Provides tenant-specific data throughout the application
// ============================================================================

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useParams } from 'next/navigation';

interface TenantBranding {
  primaryColor: string;
  logo?: string;
  name: string;
}

interface TenantSettings {
  currency: string;
  timezone: string;
}

interface Tenant {
  id: string;
  slug: string;
  name: string;
  branding: TenantBranding;
  settings: TenantSettings;
}

interface TenantContextType {
  tenant: Tenant | null;
  tenantSlug: string | null;
  isLoading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const params = useParams();
  const tenantSlug = params?.tenant as string;
  
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTenant() {
      if (!tenantSlug) {
        setIsLoading(false);
        return;
      }

      try {
        // For now, use mock data
        // TODO: Replace with actual API call to fetch tenant data
        const mockTenant: Tenant = {
          id: tenantSlug,
          slug: tenantSlug,
          name: tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1),
          branding: {
            primaryColor: tenantSlug === 'pizzahut' ? '#E03C31' : '#FF6B35',
            logo: undefined,
            name: tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1),
          },
          settings: {
            currency: 'NPR',
            timezone: 'Asia/Kathmandu',
          },
        };

        setTenant(mockTenant);
        setError(null);
      } catch (err) {
        console.error('[TenantContext] Failed to load tenant:', err);
        setError('Failed to load tenant data');
      } finally {
        setIsLoading(false);
      }
    }

    loadTenant();
  }, [tenantSlug]);

  return (
    <TenantContext.Provider value={{ tenant, tenantSlug, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
