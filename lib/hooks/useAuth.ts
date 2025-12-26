// ============================================================================
// DineOS - Authentication Hook
// ============================================================================
// Manages authentication state and provides auth utilities
// ============================================================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, clearAuthTokens } from '@/lib/api/auth';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  checkAuth: () => boolean;
}

export function useAuth(tenantSlug: string | null): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = (): boolean => {
    if (!tenantSlug) return false;
    const token = getAccessToken(tenantSlug);
    return !!token;
  };

  useEffect(() => {
    const authenticated = checkAuth();
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, [tenantSlug]);

  const logout = () => {
    if (tenantSlug) {
      clearAuthTokens(tenantSlug);
      setIsAuthenticated(false);
      router.push(`/admin/login`);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    logout,
    checkAuth,
  };
}
