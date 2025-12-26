// ============================================================================
// DineOS - Menu Card Component
// ============================================================================

'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Edit2, Trash2, BookOpen } from 'lucide-react';
import type { Menu } from '@/lib/api/menus';

interface MenuCardProps {
  menu: Menu;
  onEdit: (menu: Menu) => void;
  onDelete: (menu: Menu) => void;
}

export default function MenuCard({ menu, onEdit, onDelete }: MenuCardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleCardClick = () => {
    // Navigate to the items page for this menu
    console.log('Navigating to menu items for menu ID and pathname:', `${pathname}/${menu.id}`);
    router.push(`${pathname}/${menu.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when editing
    onEdit(menu);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when deleting
    onDelete(menu);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow p-6 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-zinc-500" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 text-lg">{menu.name}</h3>
            <p className="text-zinc-600 mt-1">{menu.description}</p>
            <div className="mt-3">
              <span 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  menu.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {menu.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4 text-zinc-600" />
          </button>
          <button
            onClick={handleDelete}
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
