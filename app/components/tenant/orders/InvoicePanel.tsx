// ============================================================================
// DineOS - POS Invoice Panel
// ============================================================================
// Right panel showing cart items, totals, and order actions
// ============================================================================

'use client';

import React from 'react';
import { Search, Trash2, Plus, Minus, FileText, Pencil } from 'lucide-react';
import { type Item } from '@/lib/api/items';
import { type Table } from '@/lib/api/tables';

export interface CartItem {
    item: Item;
    quantity: number;
    notes?: string;
}

interface InvoicePanelProps {
    cartItems: CartItem[];
    selectedTable: string;
    selectedDining: string;
    orderNumber: string;
    productDiscount: number;
    extraDiscount: number;
    couponDiscount: number;
    tables: Table[];
    onTableChange: (table: string) => void;
    onDiningChange: (dining: string) => void;
    onQuantityChange: (itemId: number, delta: number) => void;
    onRemoveItem: (itemId: number) => void;
    onAddNotes: (itemId: number) => void;
    onProductDiscountChange: (discount: number) => void;
    onExtraDiscountChange: (discount: number) => void;
    onCouponDiscountChange: (discount: number) => void;
    onPlaceOrder: () => void;
    isProcessing?: boolean;
}

export default function InvoicePanel({
    cartItems,
    selectedTable,
    selectedDining,
    orderNumber,
    productDiscount,
    extraDiscount,
    couponDiscount,
    tables,
    onTableChange,
    onDiningChange,
    onQuantityChange,
    onRemoveItem,
    onAddNotes,
    onProductDiscountChange,
    onExtraDiscountChange,
    onCouponDiscountChange,
    onPlaceOrder,
    isProcessing = false,
}: InvoicePanelProps) {
    // Calculate totals
    const subtotal = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
    const totalDiscounts = productDiscount + extraDiscount + couponDiscount;
    const total = subtotal - totalDiscounts;

    const diningOptions = ['Select Dining', 'Dine In', 'Take Away', 'Delivery'];
    
    // Generate table options from fetched tables
    const tableOptions = ['Select Table', ...tables.map(table => `Table ${table.tableNumber}`)];

    return (
        <div className="bg-white rounded-xl border border-zinc-200 h-full flex flex-col">
            {/* Search and Selectors */}
            <div className="p-4 border-b border-zinc-200 space-y-3">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search in Existing"
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                    />
                </div>

                {/* Dining and Table Selectors */}
                <div className="flex gap-3">
                    <select
                        value={selectedDining}
                        onChange={(e) => onDiningChange(e.target.value)}
                        className="flex-1 px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] text-zinc-700"
                    >
                        {diningOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <select
                        value={selectedTable}
                        onChange={(e) => onTableChange(e.target.value)}
                        className="flex-1 px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] text-zinc-700"
                    >
                        {tableOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Order Number */}
            <div className="px-4 py-3 border-b border-zinc-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-900">Order #{orderNumber}</span>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
                            <FileText className="w-8 h-8 text-zinc-400" />
                        </div>
                        <p className="text-sm text-zinc-500">No items in order</p>
                        <p className="text-xs text-zinc-400 mt-1">Add products from the menu</p>
                    </div>
                ) : (
                    cartItems.map((cartItem) => (
                        <div
                            key={cartItem.item.id}
                            className="bg-zinc-50 rounded-lg p-3 border border-zinc-100"
                        >
                            {/* Item Header */}
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-zinc-900 leading-tight">
                                        {cartItem.item.name}
                                    </h4>
                                    <p className="text-xs text-[#F97316] mt-0.5">
                                        ${cartItem.item.price.toFixed(2)} × {cartItem.quantity}=
                                        <span className="font-semibold">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => onRemoveItem(cartItem.item.id!)}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Quantity Controls and Notes */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onQuantityChange(cartItem.item.id!, -1)}
                                        className="w-7 h-7 flex items-center justify-center bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
                                    >
                                        <Minus className="w-3 h-3 text-zinc-600" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium text-zinc-800">
                                        {cartItem.quantity}
                                    </span>
                                    <button
                                        onClick={() => onQuantityChange(cartItem.item.id!, 1)}
                                        className="w-7 h-7 flex items-center justify-center bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
                                    >
                                        <Plus className="w-3 h-3 text-zinc-600" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => onAddNotes(cartItem.item.id!)}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-600 hover:bg-white border border-zinc-200 rounded-lg transition-colors"
                                >
                                    <FileText className="w-3 h-3" />
                                    {cartItem.notes ? 'Edit Notes' : 'Add Notes'}
                                </button>
                            </div>

                            {/* Notes Display */}
                            {cartItem.notes && (
                                <p className="mt-2 text-xs text-zinc-500 italic bg-white rounded px-2 py-1 border border-zinc-100">
                                    Note: {cartItem.notes}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Totals Section */}
            <div className="border-t border-zinc-200 p-3 space-y-1.5 bg-zinc-50">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-600">Sub total :</span>
                    <span className="font-semibold text-zinc-900">${subtotal.toFixed(2)}</span>
                </div>

                {/* Product Discount */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-600">Product Discount :</span>
                    <span className="text-zinc-900">${productDiscount.toFixed(2)}</span>
                </div>

                {/* Extra Discount */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-600">Extra Discount :</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const value = prompt('Enter extra discount:', extraDiscount.toString());
                                if (value !== null) onExtraDiscountChange(parseFloat(value) || 0);
                            }}
                            className="p-1 hover:bg-zinc-200 rounded transition-colors"
                        >
                            <Pencil className="w-3 h-3 text-zinc-500" />
                        </button>
                        <span className="text-zinc-900">${extraDiscount.toFixed(2)}</span>
                    </div>
                </div>

                {/* Coupon Discount */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-600">Coupon discount :</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const value = prompt('Enter coupon discount:', couponDiscount.toString());
                                if (value !== null) onCouponDiscountChange(parseFloat(value) || 0);
                            }}
                            className="p-1 hover:bg-zinc-200 rounded transition-colors"
                        >
                            <Pencil className="w-3 h-3 text-zinc-500" />
                        </button>
                        <span className="text-zinc-900">${couponDiscount.toFixed(2)}</span>
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-base pt-2 border-t border-zinc-200">
                    <span className="font-semibold text-zinc-900">Total :</span>
                    <span className="font-bold text-zinc-900 text-lg">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Place Order Button */}
            <div className="p-3 border-t border-zinc-200">
                <button
                    onClick={onPlaceOrder}
                    disabled={isProcessing || cartItems.length === 0}
                    className="w-full py-3 bg-[#F97316] hover:bg-[#EA580C] disabled:bg-zinc-300 text-white text-base font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
            </div>
        </div>
    );
}
