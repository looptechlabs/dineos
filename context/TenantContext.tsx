// ============================================================================
// DineOS - Tenant Context Provider
// ============================================================================
// React Context for tenant data that can be used across client components
// ============================================================================

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { Tenant } from '@/lib/types';

// ============================================================================
// Types
// ============================================================================

export interface TenantContextValue {
  tenant: Tenant | null;
  tenantSlug: string | null;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// Context
// ============================================================================

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

interface TenantProviderProps {
  children: ReactNode;
  tenant: Tenant | null;
  tenantSlug: string | null;
  isLoading?: boolean;
  error?: string | null;
}

export function TenantProvider({
  children,
  tenant,
  tenantSlug,
  isLoading = false,
  error = null,
}: TenantProviderProps) {
  const value: TenantContextValue = {
    tenant,
    tenantSlug,
    isLoading,
    error,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);
  
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  
  return context;
}

/**
 * Hook to get tenant with guaranteed non-null value
 * Throws if tenant is not available
 */
export function useTenantRequired(): Tenant {
  const { tenant, error, isLoading } = useTenant();
  
  if (isLoading) {
    throw new Error('Tenant is still loading');
  }
  
  if (error) {
    throw new Error(`Tenant error: ${error}`);
  }
  
  if (!tenant) {
    throw new Error('Tenant is required but not available');
  }
  
  return tenant;
}
