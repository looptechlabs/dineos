// ============================================================================
// DineOS - Table Bill Display Component
// ============================================================================
// Component to display the bill/invoice for a selected table
// ============================================================================

'use client';

import React from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';

export interface InvoiceItem {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface TableBillData {
  tableNumber: number;
  orderNumber: string;
  peopleCount?: number;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  donation?: number;
  total: number;
  status?: 'draft' | 'pending' | 'completed' | 'cancelled';
}

interface TableBillProps {
  billData: TableBillData | null;
  isLoading?: boolean;
  onClose: () => void;
}

export default function TableBill({ billData, isLoading, onClose }: TableBillProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!billData) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-zinc-900">No Bill Found</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-600" />
          </button>
        </div>
        <p className="text-zinc-500 text-center py-8">
          No active order for this table
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Table No #{billData.tableNumber}</h2>
          <p className="text-zinc-500 text-sm mt-1">Order #{billData.orderNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-zinc-600 font-medium">{billData.peopleCount || 2} People</p>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors ml-auto block mt-1"
          >
            <X className="w-5 h-5 text-zinc-600" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors text-sm">
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm">
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      {/* Ordered Items */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-zinc-900">Ordered Items</h3>
          <span className="text-zinc-500 text-sm">
            {billData.items.reduce((sum, item) => sum + item.quantity, 0).toString().padStart(2, '0')}
          </span>
        </div>

        <div className="space-y-3">
          {billData.items.map((item, index) => (
            <div key={index} className="flex items-start justify-between text-sm">
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <span className="text-zinc-600">{item.quantity}x</span>
                  <span className="text-zinc-700">{item.name}</span>
                </div>
              </div>
              <span className="font-medium text-zinc-900">
                Rs. {item.total.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="mb-6">
        <h3 className="font-semibold text-zinc-900 mb-4">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-zinc-600">
            <span>Subtotal</span>
            <span>Rs. {billData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-zinc-600">
            <span>Tax</span>
            <span>Rs. {billData.tax.toFixed(2)}</span>
          </div>
          {billData.donation && billData.donation > 0 && (
            <div className="flex justify-between text-zinc-600">
              <span>Donation for Palestine</span>
              <span>Rs. {billData.donation.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Total Payable */}
      <div className="border-t border-zinc-200 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-zinc-900">Total Payable</span>
          <span className="text-2xl font-bold text-zinc-900">
            Rs. {billData.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="font-semibold text-zinc-900 mb-4">Payment Method</h3>
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18v12H3V6zm0 4h18" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-sm font-medium text-zinc-700">Cash</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#00CFC1] bg-[#00CFC1]/10 rounded-lg hover:bg-[#00CFC1]/20 transition-colors">
            <svg className="w-5 h-5 text-[#00CFC1]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 10h20M7 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-medium text-[#00CFC1]">Card</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-medium text-zinc-700">Scan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
