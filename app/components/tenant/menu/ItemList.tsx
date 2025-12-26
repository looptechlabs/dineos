// ============================================================================
// DineOS - Item List Component
// ============================================================================

'use client';

import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import type { Item } from '@/lib/api/items';
import ItemCard from './ItemCard';

interface ItemListProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export default function ItemList({ items, onEdit, onDelete }: ItemListProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
        <UtensilsCrossed className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-zinc-900 mb-2">No items found</h3>
        <p className="text-zinc-500">Add your first item to this menu</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <ItemCard
          key={item.id || index}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
