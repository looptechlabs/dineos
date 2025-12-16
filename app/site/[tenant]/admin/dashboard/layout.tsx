// ============================================================================
// DineOS - Tenant Admin Dashboard Layout
// ============================================================================
// Route: looptech.dineos.localhost:3001/admin/dashboard/*
// ============================================================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTenant } from '@/context/TenantContext';
import Link from 'next/link';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: 'Menu', href: '/admin/dashboard/menu', icon: '📋' },
  { name: 'Orders', href: '/admin/dashboard/orders', icon: '🛒' },
  { name: 'Tables', href: '/admin/dashboard/tables', icon: '🪑' },
  { name: 'Analytics', href: '/admin/dashboard/analytics', icon: '📈' },
  { name: 'Settings', href: '/admin/dashboard/settings', icon: '⚙️' },
];

export default function TenantAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { tenant, tenantSlug } = useTenant();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('tenantAuthToken');
    const userStr = localStorage.getItem('tenantUser');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    
    setIsAuthenticated(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('tenantAuthToken');
    localStorage.removeItem('tenantUser');
    router.push('/admin/login');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const primaryColor = tenant?.branding?.primaryColor || '#6366F1';
  const tenantName = tenant?.name || 'Restaurant';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-50">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div 
            className="text-xl font-bold mb-1"
            style={{ color: primaryColor }}
          >
            {tenantName}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Admin Dashboard
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* View Live Menu Button */}
        <div className="absolute bottom-20 left-0 right-0 px-4">
          <a
            href={`/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            <span className="mr-2">🌐</span>
            <span className="font-medium text-sm">View Live Menu</span>
          </a>
        </div>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="mr-3 text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {tenantName} Admin
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email || 'Admin User'}
            </span>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: primaryColor }}
            >
              {(user?.name || tenantName).charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
