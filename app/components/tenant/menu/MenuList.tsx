// ============================================================================
// DineOS - Menu List Component
// ============================================================================

'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import type { Menu } from '@/lib/api/menus';
import MenuCard from './MenuCard';

interface MenuListProps {
  menus: Menu[];
  onEdit: (menu: Menu) => void;
  onDelete: (menu: Menu) => void;
}

export default function MenuList({ menus, onEdit, onDelete }: MenuListProps) {
  if (menus.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
        <BookOpen className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-zinc-900 mb-2">No menus found</h3>
        <p className="text-zinc-500">Create your first menu to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {menus.map((menu, index) => (
        <MenuCard
          key={menu.id || index}
          menu={menu}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
