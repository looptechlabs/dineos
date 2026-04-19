// ============================================================================
// DineOS - POS Orders Page
// ============================================================================
// Point of Sale interface for managing orders
// ============================================================================

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Search, ChevronDown } from 'lucide-react';
import { fetchMenus, type Menu } from '@/lib/api/menus';
import { fetchItems, type Item } from '@/lib/api/items';
import { getAllTables, type Table } from '@/lib/api/tables';
import { getAccessToken } from '@/lib/api/auth';

// POS Components
import MenuFilterTabs from '@/app/components/tenant/orders/MenuFilterTabs';
import ProductGrid from '@/app/components/tenant/orders/ProductGrid';
import InvoicePanel, { type CartItem } from '@/app/components/tenant/orders/InvoicePanel';
import AddNotesModal from '@/app/components/tenant/orders/AddNotesModal';
import ViewToggle, { type POSView } from '@/app/components/tenant/orders/ViewToggle';
import TableBasedOrders from '@/app/components/tenant/orders/TableBasedOrders';


// Generate order number
function generateOrderNumber(): string {
  return Math.floor(Math.random() * 900 + 100).toString();
}

export default function OrdersPage() {
  const { tenantSlug } = useTenant();
  const token = getAccessToken(tenantSlug ?? '');

  // View state
  const [currentView, setCurrentView] = useState<POSView>('pos');

  // Menu and items state
  const [menus, setMenus] = useState<Menu[]>([]);
  const [allItems, setAllItems] = useState<Map<number, Item[]>>(new Map());
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [isLoadingMenus, setIsLoadingMenus] = useState(true);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  // Tables state
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderNumber, setOrderNumber] = useState(generateOrderNumber());

  // Selection state
  const [selectedTable, setSelectedTable] = useState('Select Table');
  const [selectedDining, setSelectedDining] = useState('Select Dining');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [selectedBrand, setSelectedBrand] = useState('Select Brand');

  // Discounts state
  const [productDiscount, setProductDiscount] = useState(0);
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Notes modal state
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [notesItemId, setNotesItemId] = useState<number | null>(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load menus on mount
  useEffect(() => {
    async function loadMenus() {
      if (!tenantSlug) return;

      try {
        setIsLoadingMenus(true);
        const menuData = await fetchMenus(tenantSlug);
        setMenus(menuData);

        // Load items for all menus
        setIsLoadingItems(true);
        const itemsMap = new Map<number, Item[]>();

        await Promise.all(
          menuData.map(async (menu) => {
            if (menu.id) {
              try {
                const items = await fetchItems(tenantSlug, menu.id);
                itemsMap.set(menu.id, items);
              } catch (err) {
                console.error(`Failed to load items for menu ${menu.id}:`, err);
                itemsMap.set(menu.id, []);
              }
            }
          })
        );

        setAllItems(itemsMap);
      } catch (err) {
        console.error('Failed to load menus:', err);
        setError('Failed to load menus. Please try again.');
      } finally {
        setIsLoadingMenus(false);
        setIsLoadingItems(false);
      }
    }

    loadMenus();
  }, [tenantSlug]);

  // Load tables on mount
  useEffect(() => {
    async function loadTables() {
      if (!tenantSlug) return;

      try {
        setIsLoadingTables(true);
        const tablesData = await getAllTables(tenantSlug);
        setTables(tablesData);
      } catch (err) {
        console.error('Failed to load tables:', err);
        // Don't show error to user, just log it
      } finally {
        setIsLoadingTables(false);
      }
    }

    loadTables();
  }, [tenantSlug]);

  // Get filtered items based on selected menu
  const displayedItems = useMemo(() => {
    let items: Item[] = [];

    if (selectedMenuId === null) {
      // Show all items from all menus
      allItems.forEach((menuItems) => {
        items = [...items, ...menuItems];
      });
    } else {
      // Show items from selected menu only
      items = allItems.get(selectedMenuId) || [];
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }

    // Filter only available items
    items = items.filter((item) => item.isAvailable);

    return items;
  }, [allItems, selectedMenuId, searchQuery]);

  // Cart operations
  const addToCart = useCallback((item: Item) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.item.id === item.id);

      if (existingIndex >= 0) {
        // Increase quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        // Add new item
        return [...prev, { item, quantity: 1 }];
      }
    });
  }, []);

  const updateQuantity = useCallback((itemId: number, delta: number) => {
    setCartItems((prev) => {
      const index = prev.findIndex((ci) => ci.item.id === itemId);
      if (index < 0) return prev;

      const newQuantity = prev[index].quantity + delta;

      if (newQuantity <= 0) {
        // Remove item
        return prev.filter((ci) => ci.item.id !== itemId);
      }

      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: newQuantity };
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((itemId: number) => {
    setCartItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  }, []);

  const openNotesModal = useCallback((itemId: number) => {
    setNotesItemId(itemId);
    setNotesModalOpen(true);
  }, []);

  const saveNotes = useCallback((notes: string) => {
    if (notesItemId === null) return;

    setCartItems((prev) => {
      const index = prev.findIndex((ci) => ci.item.id === notesItemId);
      if (index < 0) return prev;

      const updated = [...prev];
      updated[index] = { ...updated[index], notes };
      return updated;
    });

    setNotesModalOpen(false);
    setNotesItemId(null);
  }, [notesItemId]);

  // Get notes item for modal
  const notesItem = useMemo(() => {
    if (notesItemId === null) return null;
    return cartItems.find((ci) => ci.item.id === notesItemId) || null;
  }, [cartItems, notesItemId]);

  // Order operations
  const handlePlaceOrder = useCallback(async () => {
    if (!tenantSlug) return;

    // Validate
    if (selectedTable === 'Select Table') {
      setError('Please select a table');
      return;
    }

    if (cartItems.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const tableNumber = selectedTable.replace('Table ', '');

      // 1. Create/Get Invoice
      const invoiceResponse = await fetch(`http://${tenantSlug}.menuly:8080/api/v1/invoices`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk'
         },
        body: JSON.stringify({ tableNumber: parseInt(tableNumber, 10) })
      });

      if (!invoiceResponse.ok) {
        const errorText = await invoiceResponse.text();
        throw new Error(`Failed to create invoice: ${errorText}`);
      }

      const invoiceData = await invoiceResponse.json();
      // Assuming invoiceId is in invoiceData.id based on "Get invoiceId from response"
      // Adjust if the response structure is different (e.g. invoiceData.data.id)
      const invoiceId = invoiceData.id || invoiceData.data?.id;

      if (!invoiceId) {
        throw new Error("Could not retrieve invoice ID from server response");
      }

      console.log('Invoice ID:', invoiceId);

      // 2. Create Orders
      // We must verify each order creation
      const orderPromises = cartItems.map(async (ci) => {
        const payload = {
          itemId: ci.item.id,
          quantity: ci.quantity,
          additionalNotes: ci.notes || "",
          tableNumber: parseInt(tableNumber, 10)
        };

        const res = await fetch(`http://${tenantSlug}.menuly:8080/api/v1/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk'
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Failed to create order for item ${ci.item.name}: ${errText}`);
        }

        return res.json();
      });

      await Promise.all(orderPromises);

      // Success - clear cart and show message
      setCartItems([]);
      // setOrderNumber(generateOrderNumber()); // Keep same order number or regen? Usually regen.
      setProductDiscount(0);
      setExtraDiscount(0);
      setCouponDiscount(0);
      setSuccessMessage('Order placed successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err) {
      console.error('Failed to place order:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  }, [tenantSlug, selectedTable, cartItems]);

  // Clear messages on interaction
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Render based on current view
  if (currentView !== 'pos') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Point of Sale (POS)</h1>
            <p className="text-sm text-zinc-500">Dashboard • Pos</p>
          </div>
          <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
        </div>

        {/* Placeholder for other views */}
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <h2 className="text-xl font-semibold text-zinc-700 mb-2">
            {currentView === 'qr-orders' && 'QR Menu Orders'}
            {currentView === 'drafts' && 'Draft Orders'}
            {currentView === 'table-orders' && <TableBasedOrders />}
          </h2>
          {/* <p className="text-zinc-500">This feature is coming soon...</p> */}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Point of Sale (POS)</h1>
          <p className="text-sm text-zinc-500">Dashboard • Pos</p>
        </div>
        <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Main POS Layout */}
      <div className="flex gap-4 h-[1000px]" >
        {/* Left Panel - Products */}
        <div className="flex-[6] flex flex-col bg-white rounded-xl border border-zinc-200 overflow-hidden">
          {/* Search and Filters */}
          <div className="p-4 border-b border-zinc-200">
            <div className="flex items-center gap-4 mb-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in products"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                >
                  <option>All Category</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>

              {/* Brand Filter */}
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                >
                  <option>Select Brand</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* Menu Filter Tabs */}
            <MenuFilterTabs
              menus={menus}
              selectedMenuId={selectedMenuId}
              onSelectMenu={setSelectedMenuId}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <ProductGrid
              items={displayedItems}
              onAddToCart={addToCart}
              isLoading={isLoadingMenus || isLoadingItems}
            />
          </div>
        </div>

        {/* Right Panel - Invoice */}
        <div className="flex-[4]">
          <InvoicePanel
            cartItems={cartItems}
            selectedTable={selectedTable}
            selectedDining={selectedDining}
            orderNumber={orderNumber}
            productDiscount={productDiscount}
            extraDiscount={extraDiscount}
            couponDiscount={couponDiscount}
            tables={tables}
            onTableChange={setSelectedTable}
            onDiningChange={setSelectedDining}
            onQuantityChange={updateQuantity}
            onRemoveItem={removeFromCart}
            onAddNotes={openNotesModal}
            onProductDiscountChange={setProductDiscount}
            onExtraDiscountChange={setExtraDiscount}
            onCouponDiscountChange={setCouponDiscount}
            onPlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      {/* Add Notes Modal */}
      <AddNotesModal
        isOpen={notesModalOpen}
        onClose={() => {
          setNotesModalOpen(false);
          setNotesItemId(null);
        }}
        onSave={saveNotes}
        itemName={notesItem?.item.name || ''}
        initialNotes={notesItem?.notes || ''}
      />
    </div>
  );
}
