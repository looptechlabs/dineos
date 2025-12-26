// ============================================================================
// DineOS - Orders Page
// ============================================================================
// Manage and track restaurant orders
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle,
  Filter,
  MoreVertical,
  Eye
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  timestamp: string;
  tableNumber?: string;
}

function OrderCard({ order, onStatusChange, onView }: { 
  order: Order; 
  onStatusChange: (orderId: string, newStatus: string) => void;
  onView: (order: Order) => void;
}) {
  const { tenant } = useTenant();
  const primaryColor = tenant?.branding?.primaryColor || '#6366F1';
  const [showActions, setShowActions] = useState(false);

  const statusConfig = {
    pending: { 
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200', 
      icon: <Clock className="w-4 h-4" />,
      label: 'Pending'
    },
    preparing: { 
      color: 'bg-blue-100 text-blue-700 border-blue-200', 
      icon: <ShoppingBag className="w-4 h-4" />,
      label: 'Preparing'
    },
    ready: { 
      color: 'bg-purple-100 text-purple-700 border-purple-200', 
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Ready'
    },
    completed: { 
      color: 'bg-green-100 text-green-700 border-green-200', 
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Completed'
    },
    cancelled: { 
      color: 'bg-red-100 text-red-700 border-red-200', 
      icon: <XCircle className="w-4 h-4" />,
      label: 'Cancelled'
    },
  };

  const config = statusConfig[order.status];

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: primaryColor }}
          >
            #{order.orderNumber}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 text-lg">{order.customer}</h3>
            <p className="text-sm text-zinc-500">{order.timestamp}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-zinc-600" />
          </button>

          {showActions && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-zinc-200 py-2 z-20">
                <button
                  onClick={() => {
                    onView(order);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <div className="border-t border-zinc-100 my-1" />
                {order.status === 'pending' && (
                  <button
                    onClick={() => {
                      onStatusChange(order.id, 'preparing');
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => {
                      onStatusChange(order.id, 'ready');
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                  >
                    Mark as Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => {
                      onStatusChange(order.id, 'completed');
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                  >
                    Complete Order
                  </button>
                )}
                <button
                  onClick={() => {
                    onStatusChange(order.id, 'cancelled');
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Cancel Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-zinc-600">
          <span>{order.items} items</span>
          {order.tableNumber && (
            <>
              <span>•</span>
              <span>Table {order.tableNumber}</span>
            </>
          )}
        </div>
        <p className="text-xl font-bold text-zinc-900">NPR {order.total}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-100">
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${config.color}`}>
          {config.icon}
          <span className="text-sm font-medium">{config.label}</span>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { tenant } = useTenant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const primaryColor = tenant?.branding?.primaryColor || '#6366F1';
  const filterOptions = ['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'];

  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      setOrders([
        {
          id: '1',
          orderNumber: '1234',
          customer: 'John Doe',
          items: 3,
          total: 850,
          status: 'preparing',
          timestamp: '5 mins ago',
          tableNumber: '12',
        },
        {
          id: '2',
          orderNumber: '1235',
          customer: 'Sarah Smith',
          items: 2,
          total: 520,
          status: 'pending',
          timestamp: '12 mins ago',
          tableNumber: '8',
        },
        {
          id: '3',
          orderNumber: '1236',
          customer: 'Mike Johnson',
          items: 5,
          total: 1200,
          status: 'ready',
          timestamp: '18 mins ago',
          tableNumber: '5',
        },
        {
          id: '4',
          orderNumber: '1237',
          customer: 'Emma Wilson',
          items: 1,
          total: 300,
          status: 'completed',
          timestamp: '25 mins ago',
        },
        {
          id: '5',
          orderNumber: '1238',
          customer: 'David Brown',
          items: 4,
          total: 980,
          status: 'preparing',
          timestamp: '32 mins ago',
          tableNumber: '15',
        },
        {
          id: '6',
          orderNumber: '1239',
          customer: 'Lisa Anderson',
          items: 2,
          total: 450,
          status: 'pending',
          timestamp: '45 mins ago',
          tableNumber: '3',
        },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus as Order['status'] }
        : order
    ));
  };

  const handleViewOrder = (order: Order) => {
    console.log('View order details:', order);
    // TODO: Implement order details modal
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Orders</h1>
        <p className="text-zinc-600">Manage and track your restaurant orders</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium mb-1">Preparing</p>
              <p className="text-3xl font-bold text-blue-900">{stats.preparing}</p>
            </div>
            <ShoppingBag className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium mb-1">Ready</p>
              <p className="text-3xl font-bold text-purple-900">{stats.ready}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-zinc-600" />
          <span className="font-medium text-zinc-900">Filter:</span>
          <div className="flex gap-2 overflow-x-auto">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setFilterStatus(option)}
                className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-colors ${
                  filterStatus === option
                    ? 'text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
                style={filterStatus === option ? { backgroundColor: primaryColor } : {}}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusChange={handleStatusChange}
            onView={handleViewOrder}
          />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-zinc-900 mb-2">No orders found</h3>
          <p className="text-zinc-500">
            {filterStatus === 'all' 
              ? 'No orders yet' 
              : `No ${filterStatus} orders`}
          </p>
        </div>
      )}
    </div>
  );
}
