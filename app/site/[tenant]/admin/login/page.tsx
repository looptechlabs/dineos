// ============================================================================
// DineOS - Tenant Admin Login Page
// ============================================================================
// Route: {tenant}.dineos.localhost:3000/admin/login
// Simple login page that checks if tenant exists first via API
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { checkTenantExists } from '@/lib/utils/checkTenant';

export default function TenantAdminLoginPage() {
  const params = useParams();
  const tenantSlug = params.tenant as string;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Tenant existence state
  const [tenantExists, setTenantExists] = useState<boolean | null>(null);
  const [checkingTenant, setCheckingTenant] = useState(true);

  // Check if tenant exists when component mounts
  useEffect(() => {
    const verifyTenant = async () => {
      if (!tenantSlug) {
        setTenantExists(false);
        setCheckingTenant(false);
        return;
      }

      console.log(`[LoginPage] Checking if tenant "${tenantSlug}" exists...`);
      const exists = await checkTenantExists(tenantSlug);
      console.log(`[LoginPage] Tenant "${tenantSlug}" exists: ${exists}`);
      
      setTenantExists(exists);
      setCheckingTenant(false);
    };

    verifyTenant();
  }, [tenantSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // TODO: Implement actual login logic later
    setTimeout(() => {
      setError('Login functionality coming soon!');
      setIsLoading(false);
    }, 1000);
  };

  // Loading state while checking tenant
  if (checkingTenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking restaurant...</p>
        </div>
      </div>
    );
  }

  // Tenant doesn't exist
  if (tenantExists === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6">🍽️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Restaurant doesn't exist
          </h1>
          <p className="text-gray-600 mb-6">
            The restaurant you're looking for could not be found.
          </p>
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <p className="text-indigo-800 text-sm">
              Want to use DineOS for your restaurant?
            </p>
            <a 
              href="http://dineos.localhost:3000" 
              className="inline-block mt-2 text-indigo-600 font-semibold hover:text-indigo-800"
            >
              Contact DineOS for quick snap menu system →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Tenant exists - show login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <span className="text-2xl text-white font-bold">
              {tenantSlug.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1)} Admin
          </h1>
          <p className="text-gray-600 mt-2">Sign in to manage your restaurant</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="admin@restaurant.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-indigo-600">DineOS</span>
          </p>
        </div>
      </div>
    </div>
  );
}
