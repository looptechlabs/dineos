// ============================================================================
// DineOS - Tenant Dashboard Home Page
// ============================================================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  activeOrders: number;
  averageOrderValue: number;
}

export default function TenantDashboardHomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todayRevenue: 0,
    activeOrders: 0,
    averageOrderValue: 0,
  });

  useEffect(() => {
    // TODO: Fetch from API
    setStats({
      todayOrders: 45,
      todayRevenue: 12500,
      activeOrders: 8,
      averageOrderValue: 278,
    });
  }, []);

  const statCards = [
    { title: "Today's Orders", value: stats.todayOrders, icon: '📋', color: 'bg-blue-500' },
    { title: "Today's Revenue", value: `NPR ${stats.todayRevenue.toLocaleString()}`, icon: '💰', color: 'bg-green-500' },
    { title: 'Active Orders', value: stats.activeOrders, icon: '⏳', color: 'bg-yellow-500' },
    { title: 'Avg. Order Value', value: `NPR ${stats.averageOrderValue}`, icon: '📊', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here&apos;s what&apos;s happening at your restaurant today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
              {stat.icon}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/app/dashboard/orders"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center"
        >
          <span className="text-3xl mr-4">🛒</span>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">View Orders</p>
            <p className="text-sm text-gray-500">Manage incoming orders</p>
          </div>
        </Link>

        <Link
          href="/app/dashboard/menu"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center"
        >
          <span className="text-3xl mr-4">📋</span>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Edit Menu</p>
            <p className="text-sm text-gray-500">Update items and prices</p>
          </div>
        </Link>

        <Link
          href="/app/dashboard/tables"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center"
        >
          <span className="text-3xl mr-4">📱</span>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">QR Codes</p>
            <p className="text-sm text-gray-500">Generate table QR codes</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Orders</h2>
          <Link href="/app/dashboard/orders" className="text-blue-600 hover:text-blue-700 text-sm">
            View All →
          </Link>
        </div>
        <div className="space-y-4">
          {[
            { id: '#1234', table: 'Table 5', items: 3, total: 'NPR 850', status: 'Preparing', time: '5 min ago' },
            { id: '#1233', table: 'Table 2', items: 5, total: 'NPR 1,200', status: 'Ready', time: '12 min ago' },
            { id: '#1232', table: 'Table 8', items: 2, total: 'NPR 450', status: 'Served', time: '18 min ago' },
          ].map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="font-mono text-sm text-gray-500">{order.id}</span>
                <span className="text-gray-800 dark:text-white">{order.table}</span>
                <span className="text-sm text-gray-500">{order.items} items</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-800 dark:text-white">{order.total}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-700' :
                  order.status === 'Ready' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {order.status}
                </span>
                <span className="text-sm text-gray-400">{order.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
