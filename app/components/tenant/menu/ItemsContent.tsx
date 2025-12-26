// ============================================================================
// DineOS - Items Content Client Component
// ============================================================================

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { fetchItems, type Item } from '@/lib/api/items';
import ItemList from './ItemList';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import DeleteItemModal from './DeleteItemModal';

interface ItemsContentProps {
  tenantSlug: string;
  menuId: number;
  primaryColor?: string;
}

export default function ItemsContent({ tenantSlug, menuId }: ItemsContentProps) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const data = await fetchItems(tenantSlug, menuId);
      setItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [tenantSlug, menuId]);

  const handleItemCreated = () => {
    loadItems();
  };

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item: Item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleEditSuccess = () => {
    loadItems();
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteSuccess = () => {
    loadItems();
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            title="Back to Menus"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Menu Items</h1>
            <p className="text-zinc-600">Manage items for this menu</p>
          </div>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Items List */}
      <ItemList 
        items={items} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleItemCreated}
        menuId={menuId}
        tenantSlug={tenantSlug}
        primaryColor="#6366F1"
      />

      {/* Edit Item Modal */}
      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        onSuccess={handleEditSuccess}
        item={selectedItem}
        tenantSlug={tenantSlug}
        primaryColor="#6366F1"
      />

      {/* Delete Confirmation Modal */}
      <DeleteItemModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedItem(null);
        }}
        onSuccess={handleDeleteSuccess}
        item={selectedItem}
        tenantSlug={tenantSlug}
        primaryColor="#6366F1"
      />
    </div>
  );
}
