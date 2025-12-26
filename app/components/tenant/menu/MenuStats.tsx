// ============================================================================
// DineOS - Menu Stats Component
// ============================================================================

import React from 'react';
import type { Menu } from '@/lib/api/menus';

interface MenuStatsProps {
  menus: Menu[];
}

export default function MenuStats({ menus }: MenuStatsProps) {
  const totalMenus = menus.length;
  const activeMenus = menus.filter(m => m.isActive).length;
  const inactiveMenus = menus.filter(m => !m.isActive).length;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-zinc-900">{totalMenus}</p>
          <p className="text-sm text-zinc-600 mt-1">Total Menus</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600">{activeMenus}</p>
          <p className="text-sm text-zinc-600 mt-1">Active</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-zinc-400">{inactiveMenus}</p>
          <p className="text-sm text-zinc-600 mt-1">Inactive</p>
        </div>
      </div>
    </div>
  );
}
