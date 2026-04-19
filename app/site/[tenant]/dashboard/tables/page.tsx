// ============================================================================
// DineOS - Tables Management Page
// ============================================================================

'use client';

import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import AddTableModal from '@/app/components/tenant/tables/AddTableModal';
import TableBill, { TableBillData, InvoiceItem } from '@/app/components/tenant/tables/TableBill';
import { getAllTables, Table } from '@/lib/api/tables';
import { fetchInvoices, Invoice } from '@/lib/api/invoices';

export default function TablesPage() {
  const { tenant } = useTenant();
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [billData, setBillData] = useState<TableBillData | null>(null);
  const [isBillLoading, setIsBillLoading] = useState(false);

  const loadTables = async () => {
    if (!tenant?.slug) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllTables(tenant.slug);
      setTables(data);
    } catch (err) {
      console.error('Error loading tables:', err);
      setError('Failed to load tables');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, [tenant?.slug]);

  const handleSuccess = () => {
    loadTables();
  };

  const handleTableClick = async (table: Table) => {
    setSelectedTable(table);
    setIsBillLoading(true);
    setBillData(null);

    try {
      // Fetch invoice for this table using table ID
      if (!table.id) {
        throw new Error('Table ID is missing');
      }

      const invoice = await fetchInvoices(tenant!.slug, table.id);
      
      if (invoice && invoice.id) {
        // Backend response format:
        // {
        //   "id": 10,
        //   "orderIds": null,
        //   "orders": [...],
        //   "status": "UNPAID",
        //   "tableNumber": 2,
        //   "tenantId": 3,
        //   "totalAmount": 21.98
        // }
        
        // Transform orders to invoice items
        const orderItems: InvoiceItem[] = invoice.orders?.map((order: any) => ({
          id: order.id,
          name: order.itemName || `Item #${order.itemId}`,
          price: order.amount / order.quantity, // Unit price
          quantity: order.quantity,
          total: order.amount,
        })) || [];

        // Calculate subtotal from orders
        const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
        
        // Calculate tax (assuming 6% tax rate)
        const taxRate = 0.06;
        const tax = subtotal * taxRate;
        
        // Optional donation
        const donation = 0; // Can be updated based on user input
        
        // Calculate total
        const total = subtotal + tax + donation;
        
        // Transform invoice data to bill format
        const transformedBillData: TableBillData = {
          tableNumber: invoice.tableNumber || table.tableNumber || 0,
          orderNumber: invoice.id?.toString() || 'N/A',
          peopleCount: 2, // Default value, can be updated based on backend data
          items: orderItems,
          subtotal: subtotal,
          tax: tax,
          donation: donation,
          total: invoice.totalAmount || total,
          status: invoice.status?.toLowerCase() === 'unpaid' ? 'pending' : 'completed',
        };

        setBillData(transformedBillData);
      } else {
        setBillData(null);
      }
    } catch (err) {
      console.error('Error fetching invoice:', err);
      setBillData(null);
    } finally {
      setIsBillLoading(false);
    }
  };

  const getTableColor = (table: Table) => {
    // You can customize this logic based on table status or orders
    // For now, using table number for demo purposes like in the original code
    if (table.tableNumber === 7) return 'bg-blue-500 text-white border-blue-600';
    if (table.tableNumber === 12) return 'bg-yellow-400 text-zinc-900 border-yellow-500';
    if (table.tableNumber === 10) return 'bg-green-500 text-white border-green-600';
    if (table.tableNumber === 20) return 'bg-red-500 text-white border-red-600';
    return 'bg-white text-zinc-900 border-zinc-200';
  };

  const handleCloseBill = () => {
    setSelectedTable(null);
    setBillData(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 flex flex-col">
      {/* Header - Always full width */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Table Management</h1>
          <p className="text-zinc-600 mt-1">Manage your restaurant seating tables</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: '#6366F1' }}
          className="flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Table
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-6 items-start">
        {/* Tables Container - Adjusts width based on whether bill is showing */}
        <div className={`flex flex-col flex-grow transition-all duration-300 ${selectedTable ? 'w-2/3' : 'w-full'}`}>
          
          {/* Table Status Legend */}
        <div className="mb-6 flex items-center gap-4 text-sm">
          <span className="text-zinc-600 font-medium">Table Status:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-zinc-600">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-zinc-600">Billed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-zinc-600">Reservation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-zinc-600">Reserved</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Tables Grid */}
        {!isLoading && tables.length > 0 && (
          <div className={`grid gap-6 ${selectedTable ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {tables.map((table) => (
              <div
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`aspect-square border-2 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col items-center justify-center ${
                  selectedTable?.id === table.id 
                    ? 'border-indigo-500 bg-indigo-50 shadow-inner' 
                    : getTableColor(table)
                }`}
              >
                <div className="text-5xl font-bold mb-3">T - {table.tableNumber}</div>
                <div className="text-sm font-medium opacity-80">Capacity: {table.capacity}</div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && tables.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200">
            <div className="text-zinc-400 text-lg mb-4">No tables found</div>
            <p className="text-zinc-500 mb-6">Click "Add Table" to create your first table</p>
          </div>
        )}
      </div>

      {/* Right Side - Bill Display (Fixed Width) */}
      {selectedTable && (
        <div className="w-[400px] flex-shrink-0">
          <div className="sticky top-6">
            <TableBill 
              billData={billData} 
              isLoading={isBillLoading}
              onClose={handleCloseBill}
            />
          </div>
        </div>
      )}
      </div>

      {/* Add Table Modal */}
      <AddTableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        tenantSlug={tenant?.slug || ''}
      />
    </div>
  );
}