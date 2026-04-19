// ============================================================================
// DineOS - POS Menu Filter Tabs
// ============================================================================
// Category filter tabs for POS product filtering
// ============================================================================

'use client';

import React from 'react';
import { type Menu } from '@/lib/api/menus';

interface MenuFilterTabsProps {
    menus: Menu[];
    selectedMenuId: number | null;
    onSelectMenu: (menuId: number | null) => void;
}

export default function MenuFilterTabs({ menus, selectedMenuId, onSelectMenu }: MenuFilterTabsProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* Show All button */}
            <button
                onClick={() => onSelectMenu(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${selectedMenuId === null
                        ? 'bg-[#F97316] text-white shadow-md'
                        : 'bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200'
                    }`}
            >
                Show All
            </button>

            {/* Menu category buttons */}
            {menus.map((menu) => (
                <button
                    key={menu.id}
                    onClick={() => onSelectMenu(menu.id!)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${selectedMenuId === menu.id
                            ? 'bg-[#F97316] text-white shadow-md'
                            : 'bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200'
                        }`}
                >
                    {menu.name}
                </button>
            ))}
        </div>
    );
}
