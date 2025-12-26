
'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { updateMenu, type Menu } from '@/lib/api/menus';

interface EditMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  menu: Menu | null;
  tenantSlug: string;
  primaryColor?: string;
}

export default function EditMenuModal({
  isOpen,
  onClose,
  onSuccess,
  menu,
  tenantSlug,
  primaryColor = '#6366F1',
}: EditMenuModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name,
        description: menu.description,
        isActive: menu.isActive,
      });
    }
  }, [menu]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menu?.id) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateMenu(tenantSlug, menu.id, formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({ name: '', description: '', isActive: true });
    } catch (err) {
      console.error('Error updating menu:', err);
      setError(err instanceof Error ? err.message : 'Failed to update menu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', isActive: true });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h2 className="text-xl font-semibold text-zinc-900">Edit Menu</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
              Menu Name *
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
             
              placeholder="e.g., Lunch Menu"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg  resize-none"
              rows={3}
              placeholder="Brief description of the menu"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-zinc-300 "
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-zinc-700">
              Active (visible to customers)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {isSubmitting ? 'Updating...' : 'Update Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
