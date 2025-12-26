import React, { useState } from 'react';
import { Mail, Lock, QrCode, ArrowRight, Smartphone, Zap } from 'lucide-react';
import { Input } from '@/app/components/tenant/ui/Input';
import { getTenantSlug } from '@/lib/utils/getTenant';
import { tenantAdminLogin, storeAuthTokens } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const tenantSlug = await getTenantSlug();

    if (!tenantSlug) {
      setError('Unable to determine tenant. Please check the URL.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await tenantAdminLogin(tenantSlug, { email, password });
      
      if (response.success && response.access_token && response.refresh_token) {
        // Store authentication tokens
        storeAuthTokens(tenantSlug, response.access_token, response.refresh_token);
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(response.message || 'Invalid email or password');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex w-full font-sans overflow-hidden">
      
      {/* Left Side - Visual / Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 flex-col justify-between p-12 overflow-hidden border-r border-zinc-900">
        
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
           <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-purple-900/20 rounded-full blur-[120px]" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px]" />
        </div>

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">DineOS</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
              Contactless Dining
            </span>
          </h1>
          <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
            Empower your restaurant with seamless QR ordering. 
            Instant menus, direct payments, and real-time kitchen syncing.
          </p>
          
          <div className="flex gap-4">
             <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900/50 backdrop-blur-md rounded-lg border border-zinc-800">
                <Smartphone className="text-purple-400 w-5 h-5" />
                <span className="text-sm text-zinc-300">Scan to Order</span>
             </div>
             <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900/50 backdrop-blur-md rounded-lg border border-zinc-800">
                <Zap className="text-pink-400 w-5 h-5" />
                <span className="text-sm text-zinc-300">Instant Pay</span>
             </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="relative z-10 text-sm text-zinc-600">
          Trusted by 500+ restaurants worldwide.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
         {/* Mobile Background Blob */}
        <div className="lg:hidden absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-purple-800/30 rounded-full blur-[80px]" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
            <p className="text-zinc-400">
              Manage your menus, orders, and tenants efficiently.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-xl text-sm flex items-center animate-shake">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Email Address"
                id="email"
                type="email"
                placeholder="admin@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail className="w-5 h-5" />}
              />

              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock className="w-5 h-5" />}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-600/50 focus:ring-offset-0" />
                <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 focus:ring-4 focus:ring-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
             <p className="text-sm text-zinc-500">
               Need to register a new restaurant? <a href="#" className="text-white hover:underline">Contact Sales</a>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}