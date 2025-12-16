// ============================================================================
// DineOS - Superadmin Dashboard Home
// ============================================================================

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PlatformStats {
  totalTenants: number;
  activeTenants: number;
  pendingTenants: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats>({
    totalTenants: 0,
    activeTenants: 0,
    pendingTenants: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    // Simulated data for development
    setStats({
      totalTenants: 12,
      activeTenants: 10,
      pendingTenants: 2,
      totalOrders: 1547,
      totalRevenue: 125000,
    });
  }, []);

  const statCards = [
    {
      title: 'Total Tenants',
      value: stats.totalTenants,
      icon: '🏪',
      color: 'bg-blue-500',
    },
    {
      title: 'Active Tenants',
      value: stats.activeTenants,
      icon: '✅',
      color: 'bg-green-500',
    },
    {
      title: 'Pending Setup',
      value: stats.pendingTenants,
      icon: '⏳',
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: '📋',
      color: 'bg-purple-500',
    },
    {
      title: 'Platform Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome to DineOS Admin
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your multi-tenant restaurant platform from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
              {stat.icon}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {stat.title}
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/dashboard/tenants/new"
            className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-2xl mr-4">➕</span>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">
                Create New Tenant
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Onboard a new restaurant
              </p>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/tenants"
            className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-2xl mr-4">🏪</span>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">
                Manage Tenants
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View and edit restaurants
              </p>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/analytics"
            className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-2xl mr-4">📈</span>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">
                View Analytics
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Platform performance
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Tenants Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Tenants
          </h2>
          <Link
            href="/admin/dashboard/tenants"
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-medium">Restaurant</th>
                <th className="pb-3 font-medium">Subdomain</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-gray-200">
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3">Burger House Nepal</td>
                <td className="py-3">
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    burgerhouse.dineos.localhost:3000
                  </code>
                </td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Active
                  </span>
                </td>
                <td className="py-3 text-gray-500">2 days ago</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3">Pizza Hut Nepal</td>
                <td className="py-3">
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    pizzahut.dineos.localhost:3000
                  </code>
                </td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Active
                  </span>
                </td>
                <td className="py-3 text-gray-500">5 days ago</td>
              </tr>
              <tr>
                <td className="py-3">Momo House</td>
                <td className="py-3">
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    momohouse.dineos.localhost:3000
                  </code>
                </td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    Pending
                  </span>
                </td>
                <td className="py-3 text-gray-500">1 week ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
