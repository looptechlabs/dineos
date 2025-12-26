// ============================================================================
// DineOS - Item Card Component
// ============================================================================

'use client';

import React from 'react';
import { Edit2, Trash2, UtensilsCrossed, Leaf } from 'lucide-react';
import type { Item } from '@/lib/api/items';

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export default function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  const getTypeIcon = () => {
    switch (item.type) {
      case 'VEGETARIAN':
        return <Leaf className="w-4 h-4 text-green-600" />;
      case 'VEGAN':
        return <Leaf className="w-4 h-4 text-green-700" />;
      case 'NON_VEGETARIAN':
        return <UtensilsCrossed className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'VEGETARIAN':
        return 'Vegetarian';
      case 'VEGAN':
        return 'Vegan';
      case 'NON_VEGETARIAN':
        return 'Non-Veg';
      default:
        return item.type;
    }
  };

  const getTypeBgColor = () => {
    switch (item.type) {
      case 'VEGETARIAN':
        return 'bg-green-100 text-green-700';
      case 'VEGAN':
        return 'bg-green-50 text-green-800';
      case 'NON_VEGETARIAN':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-zinc-100 text-zinc-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-zinc-900 text-lg">{item.name}</h3>
                {getTypeIcon()}
              </div>
              <p className="text-zinc-600 text-sm mb-3">{item.description}</p>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-bold text-zinc-900">
                  ${item.price.toFixed(2)}
                </span>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBgColor()}`}>
                  {getTypeLabel()}
                </span>
                
                <span 
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.isAvailable 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(item)}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4 text-zinc-600" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
