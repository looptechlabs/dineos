// components/tenant/orders/TableOrders.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { getAccessToken } from '@/lib/api/auth';
import { getTenantSlug } from '@/lib/utils/getTenant';

// --- Types ---
type Order = {
  additionalNotes: string;
  amount: number;
  id: number;
  itemId: number;
  quantity: number;
  status: string;
  tableNumber: number;
};

type OrdersByTable = {
  [tableNumber: string]: Order[];
};

// --- Icons ---
const TableIcon = ({ isActive }: { isActive: boolean }) => (
  <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
    <circle cx="32" cy="32" r="24" fill={isActive ? "#FEF3C7" : "#F3F4F6"} stroke={isActive ? "#D97706" : "#D1D5DB"} strokeWidth="2"/>
    <circle cx="16" cy="32" r="4" fill={isActive ? "#FBBF24" : "#9CA3AF"}/>
    <circle cx="48" cy="32" r="4" fill={isActive ? "#FBBF24" : "#9CA3AF"}/>
    <circle cx="32" cy="16" r="4" fill={isActive ? "#FBBF24" : "#9CA3AF"}/>
    <circle cx="32" cy="48" r="4" fill={isActive ? "#FBBF24" : "#9CA3AF"}/>
  </svg>
);

export default function TableOrders() {
  const [orders, setOrders] = useState<OrdersByTable>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // New State: Track which table is currently clicked
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTenantAndToken() {
      const slug = await getTenantSlug();
      setTenantSlug(slug);
      setToken(getAccessToken(slug));
    }
    fetchTenantAndToken();
  }, []);

  useEffect(() => {
    async function fetchOrders() {
      if (!tenantSlug || !token) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/table-orders?tenantSlug=${tenantSlug}&token=${token}`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        const responseJson = await res.json();
        
        if (responseJson.success) {
            const fetchedOrders = responseJson.data;
            setOrders(fetchedOrders);
            
            // Auto-select the first table if none is selected yet
            const tableKeys = Object.keys(fetchedOrders);
            if (tableKeys.length > 0 && !selectedTable) {
                setSelectedTable(tableKeys[0]);
            }
        } else {
            throw new Error(responseJson.message);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [tenantSlug, token]); // Removed selectedTable from dependency to prevent loop

  if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse">Loading POS...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;
  if (!orders || Object.keys(orders).length === 0) return <div className="p-10 text-center text-gray-400">No active orders found.</div>;

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] bg-gray-50 border-t border-gray-200">
      
      {/* LEFT SIDE: Table List */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
           <h2 className="font-bold text-gray-700">Active Tables ({Object.keys(orders).length})</h2>
        </div>
        
        <div className="p-2 space-y-2">
          {Object.entries(orders).map(([table, tableOrders]) => {
            const isActive = selectedTable === table;
            const totalAmount = tableOrders.reduce((sum, item) => sum + item.amount, 0);

            return (
              <button
                key={table}
                onClick={() => setSelectedTable(table)}
                className={`w-full flex items-center p-4 rounded-xl transition-all duration-200 text-left border
                  ${isActive 
                    ? 'bg-orange-50 border-orange-200 shadow-sm ring-1 ring-orange-200' 
                    : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                  }`}
              >
                <div className="mr-4">
                  <TableIcon isActive={isActive} />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${isActive ? 'text-orange-900' : 'text-gray-700'}`}>
                    Table {table}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {tableOrders.length} Items • <span className="text-gray-900 font-bold">₹{totalAmount}</span>
                  </p>
                </div>
                {/* Arrow indicator for active state */}
                {isActive && <div className="ml-auto text-orange-500">➜</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE: Order Details */}
      <div className="w-full md:w-2/3 lg:w-3/4 bg-gray-50 p-6 overflow-y-auto">
        {selectedTable && orders[selectedTable] ? (
          <div className="max-w-3xl mx-auto">
             {/* Header for Detail View */}
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800">Order Details</h1>
                    <p className="text-gray-500">Viewing Table {selectedTable}</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Due</span>
                    <div className="text-xl font-bold text-green-600">
                        ₹{orders[selectedTable].reduce((acc, curr) => acc + curr.amount, 0)}
                    </div>
                </div>
             </div>

             {/* Order Items List */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {orders[selectedTable].map((order) => (
                  <div key={order.id} className="p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            {/* Quantity Badge */}
                            <div className="bg-gray-100 text-gray-800 font-bold text-lg h-10 w-10 flex items-center justify-center rounded-lg">
                                {order.quantity}x
                            </div>
                            
                            {/* Item Info */}
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">Item #{order.itemId}</h4>
                                {order.additionalNotes && (
                                    <p className="text-sm text-gray-500 mt-1 italic">
                                        Note: {order.additionalNotes}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Status & Price */}
                        <div className="text-right">
                             <div className="font-bold text-gray-900 text-lg mb-1">₹{order.amount}</div>
                             <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
                                ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                                  order.status === 'SERVED' ? 'bg-green-100 text-green-700' : 
                                  'bg-gray-100 text-gray-600'}`}>
                                {order.status}
                             </span>
                        </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <p>Select a table to view details</p>
          </div>
        )}
      </div>

    </div>
  );
}