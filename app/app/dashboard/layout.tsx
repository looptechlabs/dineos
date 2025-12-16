// ============================================================================
// DineOS - Tenant Dashboard Home
// ============================================================================

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: '📊' },
  { name: 'Menu', href: '/app/dashboard/menu', icon: '📋' },
  { name: 'Orders', href: '/app/dashboard/orders', icon: '🛒' },
  { name: 'Tables', href: '/app/dashboard/tables', icon: '🪑' },
  { name: 'Analytics', href: '/app/dashboard/analytics', icon: '📈' },
  { name: 'Settings', href: '/app/dashboard/settings', icon: '⚙️' },
];

export default function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tenantName, setTenantName] = useState('Restaurant');

  useEffect(() => {
    const token = localStorage.getItem('tenantToken');
    if (!token) {
      router.push('/app/login');
    } else {
      setIsAuthenticated(true);
      // TODO: Fetch tenant info from API
      setTenantName('Burger House Nepal');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('tenantToken');
    router.push('/app/login');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
        {/* Logo & Tenant Name */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-blue-600">DineOS</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
            {tenantName}
          </p>
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

        {/* View Live Menu */}
        <div className="absolute bottom-20 left-0 right-0 px-4">
          <a
            href="http://burgerhouse.dineos.localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            <span className="mr-2">🌐</span>
            <span className="font-medium">View Live Menu</span>
          </a>
        </div>

        {/* Logout Button */}
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
            Dashboard
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              owner@burgerhouse.com
            </span>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              BH
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
