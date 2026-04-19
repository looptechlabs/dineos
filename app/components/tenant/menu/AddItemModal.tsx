// ============================================================================
// DineOS - Add Item Modal Component
// ============================================================================

'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createItem, type Item } from '@/lib/api/items';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  menuId: number;
  tenantSlug: string;
  primaryColor?: string;
}

export default function AddItemModal({
  isOpen,
  onClose,
  onSuccess,
  menuId,
  tenantSlug,
  primaryColor = '#6366F1',
}: AddItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true,
    type: 'VEGETARIAN' as 'VEGETARIAN' | 'NON_VEGETARIAN' ,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const itemData = {
        menu_id: menuId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        isAvailable: formData.isAvailable,
        type: formData.type,
      };

      await createItem(tenantSlug, itemData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        isAvailable: true,
        type: 'VEGETARIAN',
      });
    } catch (err) {
      console.error('Error creating item:', err);
      setError(err instanceof Error ? err.message : 'Failed to create item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      isAvailable: true,
      type: 'VEGETARIAN',
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-zinc-900">Add New Item</h2>
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
              Item Name *
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all duration-200 shadow-sm"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
              placeholder="e.g., Chicken Pizza"
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
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all duration-200 shadow-sm resize-none"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
              rows={3}
              placeholder="Brief description of the item"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-zinc-700 mb-1">
              Price ($) *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all duration-200 shadow-sm"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
              placeholder="10.99"
            />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-zinc-700 mb-1">
              Type *
            </label>
            <select
              id="type"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all duration-200 shadow-sm"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            >
              <option value="VEGETARIAN">Vegetarian</option>
              <option value="NON_VEGETARIAN">Non-Vegetarian</option>
              <option value="VEGAN">Vegan</option>
            </select>
          </div>

          {/* Available Status */}
          <div className="flex items-center">
            <input
              id="isAvailable"
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-4 h-4 rounded border-zinc-300 focus:ring-2 focus:ring-opacity-50"
              style={{ accentColor: primaryColor }}
            />
            <label htmlFor="isAvailable" className="ml-2 text-sm text-zinc-700">
              Available for order
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
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
