// ============================================================================
// DineOS - Dashboard Home Page
// ============================================================================
// Main dashboard overview with stats and activity
// ============================================================================

'use client';

import React, { useEffect, useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Users,
  Activity,
  Clock
} from 'lucide-react';

interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  activeOrders: number;
  totalCustomers: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: string;
}

function StatCard({ title, value, icon, trend, trendUp, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-zinc-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-zinc-600 font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-zinc-900 mb-2">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1">
              <TrendingUp 
                className={`w-4 h-4 ${trendUp ? 'text-green-500' : 'text-red-500 rotate-180'}`}
              />
              <span className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {trend}
              </span>
              <span className="text-sm text-zinc-500">vs yesterday</span>
            </div>
          )}
        </div>
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

interface RecentOrder {
  id: string;
  customer: string;
  items: number;
  amount: number;
  time: string;
  status: 'pending' | 'preparing' | 'completed';
}

function RecentOrderCard({ order }: { order: RecentOrder }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    preparing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-zinc-200 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-zinc-600" />
        </div>
        <div>
          <p className="font-semibold text-zinc-900">{order.customer}</p>
          <p className="text-sm text-zinc-500">{order.items} items • {order.time}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-bold text-zinc-900">NPR {order.amount}</p>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { tenant } = useTenant();
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todayRevenue: 0,
    activeOrders: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      setStats({
        todayOrders: 48,
        todayRevenue: 12500,
        activeOrders: 7,
        totalCustomers: 234,
      });

      setRecentOrders([
        {
          id: '1',
          customer: 'John Doe',
          items: 3,
          amount: 850,
          time: '5 mins ago',
          status: 'preparing',
        },
        {
          id: '2',
          customer: 'Sarah Smith',
          items: 2,
          amount: 520,
          time: '12 mins ago',
          status: 'pending',
        },
        {
          id: '3',
          customer: 'Mike Johnson',
          items: 5,
          amount: 1200,
          time: '18 mins ago',
          status: 'completed',
        },
        {
          id: '4',
          customer: 'Emma Wilson',
          items: 1,
          amount: 300,
          time: '25 mins ago',
          status: 'completed',
        },
      ]);

      setIsLoading(false);
    }, 800);
  }, []);

  const primaryColor = tenant?.branding?.primaryColor || '#6366F1';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-zinc-600">
          Here's what's happening with your restaurant today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders}
          icon={<ShoppingBag className="w-6 h-6" />}
          trend="+12%"
          trendUp={true}
          color={primaryColor}
        />
        <StatCard
          title="Today's Revenue"
          value={`NPR ${stats.todayRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6" />}
          trend="+8%"
          trendUp={true}
          color="#10B981"
        />
        <StatCard
          title="Active Orders"
          value={stats.activeOrders}
          icon={<Activity className="w-6 h-6" />}
          color="#F59E0B"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<Users className="w-6 h-6" />}
          trend="+23"
          trendUp={true}
          color="#8B5CF6"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-600" />
            <h2 className="text-xl font-bold text-zinc-900">Recent Orders</h2>
          </div>
          <button 
            className="text-sm font-medium hover:underline"
            style={{ color: primaryColor }}
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {recentOrders.map((order) => (
            <RecentOrderCard key={order.id} order={order} />
          ))}
        </div>

        {recentOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-500">No recent orders</p>
          </div>
        )}
      </div>
    </div>
  );
}
