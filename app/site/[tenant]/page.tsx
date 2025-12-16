// ============================================================================
// DineOS - Customer Menu Page (Tenant Subdomain)
// ============================================================================
// Routes: [tenant].dineos.localhost:3000 (e.g., burgerhouse.dineos.localhost:3000)
// ============================================================================

import { getTenantSlugFromHeaders } from '@/lib/server/tenant';
import { createTenantApiClient } from '@/lib/api-client';
import MenuClient from './MenuClient';

// Mock menu data for development
const mockMenu = {
  categories: [
    {
      id: '1',
      name: 'Burgers',
      description: 'Our signature burgers made with 100% beef',
      displayOrder: 1,
      items: [
        {
          id: '101',
          name: 'Classic Burger',
          description: 'Juicy beef patty with lettuce, tomato, onion, and our special sauce',
          price: 350,
          categoryId: '1',
          isAvailable: true,
          preparationTime: 15,
          allergens: ['gluten', 'dairy'],
          tags: ['popular', 'bestseller'],
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        },
        {
          id: '102',
          name: 'Cheese Burger',
          description: 'Classic burger with melted cheddar cheese',
          price: 420,
          categoryId: '1',
          isAvailable: true,
          preparationTime: 15,
          allergens: ['gluten', 'dairy'],
          tags: ['popular'],
          imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
        },
        {
          id: '103',
          name: 'Double Patty Burger',
          description: 'Two juicy beef patties with all the fixings',
          price: 550,
          categoryId: '1',
          isAvailable: true,
          preparationTime: 20,
          allergens: ['gluten', 'dairy'],
          tags: ['popular'],
          imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400',
        },
      ],
    },
    {
      id: '2',
      name: 'Sides',
      description: 'Perfect companions to your meal',
      displayOrder: 2,
      items: [
        {
          id: '201',
          name: 'French Fries',
          description: 'Crispy golden fries with seasoning',
          price: 150,
          categoryId: '2',
          isAvailable: true,
          preparationTime: 10,
          allergens: ['gluten'],
          tags: [],
          imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        },
        {
          id: '202',
          name: 'Onion Rings',
          description: 'Crispy battered onion rings',
          price: 180,
          categoryId: '2',
          isAvailable: true,
          preparationTime: 10,
          allergens: ['gluten'],
          tags: [],
          imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400',
        },
      ],
    },
    {
      id: '3',
      name: 'Beverages',
      description: 'Refresh yourself',
      displayOrder: 3,
      items: [
        {
          id: '301',
          name: 'Coca Cola',
          description: 'Classic Coca Cola (500ml)',
          price: 100,
          categoryId: '3',
          isAvailable: true,
          preparationTime: 1,
          allergens: [],
          tags: [],
        },
        {
          id: '302',
          name: 'Fresh Lime Soda',
          description: 'Refreshing lime soda',
          price: 120,
          categoryId: '3',
          isAvailable: true,
          preparationTime: 5,
          allergens: [],
          tags: ['popular'],
        },
      ],
    },
  ],
};

interface PageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function CustomerMenuPage({ params }: PageProps) {
  const { tenant: tenantSlug } = await params;
  
  // In production, fetch menu from API
  // const apiClient = createTenantApiClient(tenantSlug);
  // const menuResponse = await apiClient.menu.getMenu();
  // const menu = menuResponse.data;

  // For development, use mock data
  const menu = mockMenu;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Welcome! 👋
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Browse our menu and order your favorites
        </p>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-[72px] z-40 bg-white dark:bg-gray-900 py-3 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          {menu.categories.map((category) => (
            <a
              key={category.id}
              href={`#category-${category.id}`}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <MenuClient categories={menu.categories} currency="NPR" />
    </div>
  );
}
