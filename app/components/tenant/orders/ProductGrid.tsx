// ============================================================================
// DineOS - POS Product Grid
// ============================================================================
// Grid display of menu items for POS
// ============================================================================

'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { type Item } from '@/lib/api/items';

interface ProductGridProps {
    items: Item[];
    onAddToCart: (item: Item) => void;
    isLoading?: boolean;
}

export default function ProductGrid({ items, onAddToCart, isLoading }: ProductGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-zinc-200 p-4 animate-pulse">
                        <div className="aspect-square bg-zinc-100 rounded-lg mb-3" />
                        <div className="h-4 bg-zinc-100 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-zinc-100 rounded w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-700 mb-1">No products found</h3>
                <p className="text-sm text-zinc-500">Try selecting a different category</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-xl border border-zinc-200 p-4 hover:shadow-lg hover:border-zinc-300 transition-all duration-200 group relative"
                >
                    {/* Product Image */}
                    <div className="aspect-square bg-zinc-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                        {item.imageUrl ? (
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
                                <svg className="w-12 h-12 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Add Button - positioned at top-right of image */}
                    <button
                        onClick={() => onAddToCart(item)}
                        className="absolute top-16 right-6 w-7 h-7 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 opacity-90 hover:opacity-100 hover:scale-110"
                        title="Add to order"
                    >
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                    </button>

                    {/* Product Info */}
                    <div className="space-y-1">
                        <h3 className="font-medium text-zinc-800 text-sm leading-tight line-clamp-2">
                            {item.name}
                        </h3>
                        <p className="text-[#F97316] font-semibold text-sm">
                            ${item.price.toFixed(2)}
                        </p>
                    </div>

                    {/* Availability Badge */}
                    {!item.isAvailable && (
                        <div className="absolute top-2 left-2 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                            Unavailable
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
