// ============================================================================
// DineOS - Delete Confirmation Modal Component
// ============================================================================

'use client';

import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { deleteMenu, type Menu } from '@/lib/api/menus';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  menu: Menu | null;
  tenantSlug: string;
  primaryColor?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onSuccess,
  menu,
  tenantSlug,
  primaryColor = '#6366F1',
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!menu?.id) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteMenu(tenantSlug, menu.id);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error deleting menu:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete menu');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen || !menu) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900">Delete Menu</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <p className="text-zinc-700">
            Are you sure you want to delete the menu <strong>&quot;{menu.name}&quot;</strong>?
          </p>
          <p className="text-sm text-zinc-600">
            This action cannot be undone. All items associated with this menu may also be affected.
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Menu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
