// ============================================================================
// DineOS - Add Menu Button Component
// ============================================================================

'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface AddMenuButtonProps {
  primaryColor?: string;
  onClick?: () => void;
}

export default function AddMenuButton({ 
  primaryColor = '#6366F1',
  onClick 
}: AddMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
      style={{ backgroundColor: primaryColor }}
    >
      <Plus className="w-5 h-5" />
      Add New Menu
    </button>
  );
}
