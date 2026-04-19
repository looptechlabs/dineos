// ============================================================================
// DineOS - Add Table Modal Component
// ============================================================================

'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createTable } from '@/lib/api/tables';

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tenantSlug: string;
  primaryColor?: string;
}

export default function AddTableModal({
  isOpen,
  onClose,
  onSuccess,
  tenantSlug,
  primaryColor = '#6366F1',
}: AddTableModalProps) {
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const tableData = {
        tableNumber: parseInt(formData.tableNumber),
        capacity: parseInt(formData.capacity),
      };

      if (isNaN(tableData.tableNumber) || isNaN(tableData.capacity)) {
        throw new Error('Table number and capacity must be valid numbers');
      }

      if (tableData.tableNumber <= 0 || tableData.capacity <= 0) {
        throw new Error('Table number and capacity must be greater than 0');
      }

      await createTable(tenantSlug, tableData);
      // Reset form
      setFormData({ tableNumber: '', capacity: '' });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating table:', err);
      let errorMessage = 'Failed to create table. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        // Try to parse if the message is a JSON string
        try {
          const parsed = JSON.parse(errorMessage);
          errorMessage = parsed.message || errorMessage;
        } catch {
          // Not JSON, use as is
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-zinc-900">Add New Table</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-zinc-600" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Table Number Field */}
          <div>
            <label htmlFor="tableNumber" className="block text-sm font-medium text-zinc-700 mb-1">
              Table Number *
            </label>
            <input
              type="number"
              id="tableNumber"
              name="tableNumber"
              value={formData.tableNumber}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter table number"
              disabled={isSubmitting}
            />
          </div>

          {/* Capacity Field */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-zinc-700 mb-1">
              Capacity *
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter seating capacity"
              disabled={isSubmitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: isSubmitting ? '#9CA3AF' : primaryColor }}
              className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-all font-medium disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Table'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}