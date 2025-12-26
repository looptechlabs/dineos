// ============================================================================
// DineOS - Menus Content Client Component
// ============================================================================

'use client';

import React, { useEffect, useState } from 'react';
import { fetchMenus, type Menu } from '@/lib/api/menus';
import MenuList from './MenuList';
import MenuStats from './MenuStats';
import AddMenuButton from './AddMenuButton';
import AddMenuModal from './AddMenuModal';
import EditMenuModal from './EditMenuModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface MenusContentProps {
  tenantSlug: string;
  primaryColor?: string;
}

export default function MenusContent({ tenantSlug }: MenusContentProps) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const loadMenus = async () => {
    try {
      setIsLoading(true);
      const data = await fetchMenus(tenantSlug);
      setMenus(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching menus:', err);
      setError('Failed to load menus. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, [tenantSlug]);

  const handleMenuCreated = () => {
    // Refresh the menus list
    loadMenus();
  };

  const handleEdit = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsEditModalOpen(true);
  };

  const handleDelete = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsDeleteModalOpen(true);
  };

  const handleEditSuccess = () => {
    loadMenus();
    setIsEditModalOpen(false);
    setSelectedMenu(null);
  };

  const handleDeleteSuccess = () => {
    loadMenus();
    setIsDeleteModalOpen(false);
    setSelectedMenu(null);
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
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Menus</h1>
          <p className="text-zinc-600">Manage your restaurant menus</p>
        </div>
        <AddMenuButton 
          primaryColor="#6366F1" 
          onClick={() => setIsAddModalOpen(true)} 
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Menus List */}
      <MenuList 
        menus={menus} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Stats */}
      <MenuStats menus={menus} />

      {/* Add Menu Modal */}
      <AddMenuModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleMenuCreated}
        tenantSlug={tenantSlug}
        primaryColor="#6366F1"
      />

      {/* Edit Menu Modal */}
      <EditMenuModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMenu(null);
        }}
        onSuccess={handleEditSuccess}
        menu={selectedMenu}
        tenantSlug={tenantSlug}
        primaryColor="#6366F1"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMenu(null);
        }}
        onSuccess={handleDeleteSuccess}
        menu={selectedMenu}
        tenantSlug={tenantSlug}
        primaryColor="#6366F1"
      />
    </div>
  );
}
