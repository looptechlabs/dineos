// ============================================================================
// DineOS - Customer Menu Client Component
// ============================================================================
// Handles interactive menu browsing and cart functionality
// ============================================================================

'use client';

import { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import type { MenuCategory, MenuItem } from '@/lib/types';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

interface MenuClientProps {
  categories: MenuCategory[];
  currency: string;
}

export default function MenuClient({ categories, currency }: MenuClientProps) {
  const { tenant } = useTenant();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);

  const addToCart = (item: MenuItem, qty: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.menuItem.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { menuItem: item, quantity: qty }];
    });
    setSelectedItem(null);
    setQuantity(1);
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  const primaryColor = tenant?.branding.primaryColor || '#6366F1';

  return (
    <>
      {/* Menu Categories */}
      <div className="space-y-10">
        {categories.map((category) => (
          <section key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
            {/* Category Header */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {category.description}
                </p>
              )}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items
                .filter((item) => item.isAvailable)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex"
                  >
                    {/* Item Image */}
                    {item.imageUrl && (
                      <div className="w-28 h-28 flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Item Details */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-gray-800 dark:text-white">
                            {item.name}
                          </h4>
                          {item.tags.includes('popular') && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold" style={{ color: primaryColor }}>
                          {currency} {item.price.toLocaleString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg"
                          style={{ backgroundColor: primaryColor }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-lg max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Item Image */}
            {selectedItem.imageUrl && (
              <div className="w-full h-48">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Item Info */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {selectedItem.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {selectedItem.description}
              </p>

              {/* Tags */}
              {selectedItem.allergens.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Allergens:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.allergens.map((allergen) => (
                      <span
                        key={allergen}
                        className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-lg text-gray-600 dark:text-gray-400">Quantity:</span>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(selectedItem, quantity)}
                className="w-full mt-6 py-4 rounded-xl text-white font-semibold text-lg"
                style={{ backgroundColor: primaryColor }}
              >
                Add to Cart - {currency} {(selectedItem.price * quantity).toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Summary (Updates the fixed footer) */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-40">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{getTotalItems()} items</p>
              <p className="font-bold text-gray-800 dark:text-white">
                {currency} {getTotalPrice().toLocaleString()}
              </p>
            </div>
            <button
              className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              View Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
}
