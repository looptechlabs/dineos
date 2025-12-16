// ============================================================================
// DineOS - Tenant Admin Dashboard Home
// ============================================================================

'use client';

import { useEffect, useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import Link from 'next/link';

interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  activeOrders: number;
  averageOrderValue: number;
}

export default function TenantAdminDashboardPage() {
  const { tenant, tenantSlug } = useTenant();
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todayRevenue: 0,
    activeOrders: 0,
    averageOrderValue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real stats from API
    // For now, simulating with mock data
    setTimeout(() => {
      setStats({
        todayOrders: 28,
        todayRevenue: 8500,
        activeOrders: 5,
        averageOrderValue: 303,
      });
      setIsLoading(false);
    }, 1000);
  }, [tenantSlug]);

  const currency = tenant?.settings?.currency || 'NPR';
  const primaryColor = tenant?.branding?.primaryColor || '#6366F1';

  const statCards = [
    { 
      title: "Today's Orders", 
      value: stats.todayOrders, 
      icon: '📋', 
      color: 'bg-blue-500' 
    },
    { 
      title: "Today's Revenue", 
      value: `${currency} ${stats.todayRevenue.toLocaleString()}`, 
      icon: '💰', 
      color: 'bg-green-500' 
    },
    { 
      title: 'Active Orders', 
      value: stats.activeOrders, 
      icon: '⏳', 
      color: 'bg-yellow-500' 
    },
    { 
      title: 'Avg. Order Value', 
      value: `${currency} ${stats.averageOrderValue}`, 
      icon: '📊', 
      color: 'bg-purple-500' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome to {tenant?.name} Admin Dashboard! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here&apos;s what&apos;s happening at your restaurant today.
        </p>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>🎉 System Info:</strong> You are managing tenant: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{tenantSlug}</code>
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Your customer menu is live at:{' '}
            <a 
              href={`http://${tenantSlug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'dineos.localhost:3001'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {tenantSlug}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'dineos.localhost:3001'}
            </a>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                {stat.icon}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/dashboard/orders"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex items-center group"
        >
          <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">🛒</span>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Manage Orders</p>
            <p className="text-sm text-gray-500">View and update orders</p>
          </div>
        </Link>

        <Link
          href="/admin/dashboard/menu"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex items-center group"
        >
          <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">📋</span>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Edit Menu</p>
            <p className="text-sm text-gray-500">Update items and prices</p>
          </div>
        </Link>

        <Link
          href="/admin/dashboard/tables"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex items-center group"
        >
          <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">📱</span>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">QR Codes</p>
            <p className="text-sm text-gray-500">Generate table QR codes</p>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Orders</h2>
          <Link 
            href="/admin/dashboard/orders" 
            className="text-sm hover:underline"
            style={{ color: primaryColor }}
          >
            View All →
          </Link>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-48"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { id: '#1045', table: 'Table 3', items: 4, total: 950, status: 'Preparing', time: '3 min ago' },
              { id: '#1044', table: 'Table 7', items: 2, total: 580, status: 'Ready', time: '8 min ago' },
              { id: '#1043', table: 'Table 1', items: 6, total: 1200, status: 'Served', time: '15 min ago' },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{order.id}</span>
                  <span className="text-gray-800 dark:text-white font-medium">{order.table}</span>
                  <span className="text-sm text-gray-500">{order.items} items</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {currency} {order.total}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'Ready' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-sm text-gray-400 w-24 text-right">{order.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
