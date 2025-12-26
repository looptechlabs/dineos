// ============================================================================
// DineOS - Tenant Admin Login Page
// ============================================================================
// Route: {tenant}.dineos.localhost:3000/admin/login
// Modern QR-themed login page with tenant-based authentication
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { checkTenantExists } from '@/lib/utils/checkTenant';
import { tenantAdminLogin, storeAuthTokens } from '@/lib/api/auth';

export default function TenantAdminLoginPage() {
  const params = useParams();
  const router = useRouter();
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

    try {
      // Make tenant-based login API call
      const response = await tenantAdminLogin(tenantSlug, {
        email,
        password,
      });

      console.log('[LoginPage] Login response:', response);

      if (response.success && response.access_token && response.refresh_token) {
        // Store authentication tokens
        console.log('[LoginPage] Storing tokens...');
        storeAuthTokens(tenantSlug, response.access_token, response.refresh_token);
        
        // Redirect to tenant dashboard using window.location for reliable redirect
        console.log('[LoginPage] Login successful, redirecting to dashboard');
        window.location.href = '/dashboard';
        return;
      } else {
        setError(response.message || 'Invalid email or password');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('[LoginPage] Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
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

  // Tenant exists - show modern QR-themed login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
        
        {/* QR-style grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header with QR Code Visual */}
        <div className="text-center mb-8">
          {/* QR Code Inspired Logo */}
          <div className="inline-flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-3xl shadow-2xl">
              <div className="grid grid-cols-3 gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded"></div>
                <div className="w-8 h-8 bg-white border-4 border-purple-600 rounded flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-xl">
                    {tenantSlug.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded"></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            {tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1)}
          </h1>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-400"></div>
            <p className="text-purple-300 font-medium">Admin Portal</p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-400"></div>
          </div>
          <p className="text-gray-400 text-sm">
            ⚡ Snap • Scan • Serve
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Feature badges */}
          <div className="flex gap-2 justify-center mb-6 flex-wrap">
            <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
              📱 QR Ordering
            </span>
            <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
              ⚡ Quick Snap
            </span>
            <span className="text-xs px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full border border-pink-500/30">
              🧾 POS Receipt
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm animate-shake">
                <p className="text-sm text-red-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                📧 Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl 
                         text-white placeholder-gray-400 
                         focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                         transition-all duration-300 outline-none"
                placeholder="admin@restaurant.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                🔒 Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl 
                         text-white placeholder-gray-400 
                         focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                         transition-all duration-300 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 
                       text-white font-bold rounded-xl 
                       hover:from-purple-700 hover:to-blue-700 
                       focus:ring-4 focus:ring-purple-500/50 
                       transform hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       shadow-lg shadow-purple-500/30"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  🚀 Access Dashboard
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-purple-300 hover:text-purple-200 transition-colors inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Forgot password?
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-300">
              Powered by <span className="font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">DineOS</span>
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Quick QR Menu System for Modern Restaurants
          </p>
        </div>
      </div>
    </div>
  );
}
