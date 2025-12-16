// ============================================================================
// DineOS - Typed API Client
// ============================================================================
// A TypeScript API client that automatically injects tenant headers
// and provides typed methods for all backend API calls.
// ============================================================================

import { env } from '@/lib/config/env';
import type {
  ApiResponse,
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
  TenantListFilters,
  Menu,
  MenuItem,
  MenuCategory,
  Order,
  OrderStatus,
  User,
  LoginRequest,
  LoginResponse,
  DashboardStats,
  Table,
  Reservation,
} from '@/lib/types';

// ============================================================================
// Client Configuration
// ============================================================================

interface ApiClientConfig {
  baseUrl: string;
  tenantId?: string;
  accessToken?: string;
}

class ApiClient {
  private baseUrl: string;
  private tenantId: string | null = null;
  private accessToken: string | null = null;

  constructor(config?: Partial<ApiClientConfig>) {
    this.baseUrl = config?.baseUrl || env.API_BASE_URL;
    this.tenantId = config?.tenantId || null;
    this.accessToken = config?.accessToken || null;
  }

  // =========================================================================
  // Configuration Methods
  // =========================================================================

  setTenantId(tenantId: string | null): void {
    this.tenantId = tenantId;
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  getTenantId(): string | null {
    return this.tenantId;
  }

  // =========================================================================
  // Core Request Method
  // =========================================================================

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Inject tenant ID header if available
    if (this.tenantId) {
      (headers as Record<string, string>)['x-tenant-id'] = this.tenantId;
    }

    // Inject authorization header if token is available
    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.code || 'UNKNOWN_ERROR',
            message: data.message || 'An unknown error occurred',
            details: data.details,
          },
        };
      }

      return {
        success: true,
        data: data.data ?? data,
        meta: data.meta,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network request failed',
        },
      };
    }
  }

  private get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  private post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  private put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  private patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  private delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // =========================================================================
  // Authentication API
  // =========================================================================

  auth = {
    login: (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
      this.post('/auth/login', credentials),

    logout: (): Promise<ApiResponse<void>> =>
      this.post('/auth/logout'),

    refreshToken: (refreshToken: string): Promise<ApiResponse<{ accessToken: string; expiresAt: number }>> =>
      this.post('/auth/refresh', { refreshToken }),

    me: (): Promise<ApiResponse<User>> =>
      this.get('/auth/me'),

    // Superadmin login (separate endpoint)
    superadminLogin: (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
      this.post('/auth/superadmin/login', credentials),
  };

  // =========================================================================
  // Superadmin API (Tenant Management)
  // =========================================================================

  superadmin = {
    // List all tenants
    listTenants: (filters?: TenantListFilters): Promise<ApiResponse<Tenant[]>> => {
      const params = new URLSearchParams();
      if (filters?.status) params.set('status', filters.status);
      if (filters?.search) params.set('search', filters.search);
      if (filters?.page) params.set('page', filters.page.toString());
      if (filters?.pageSize) params.set('pageSize', filters.pageSize.toString());
      const query = params.toString();
      return this.get(`/superadmin/tenants${query ? `?${query}` : ''}`);
    },

    // Get single tenant
    getTenant: (tenantId: string): Promise<ApiResponse<Tenant>> =>
      this.get(`/superadmin/tenants/${tenantId}`),

    // Create new tenant
    createTenant: (data: CreateTenantRequest): Promise<ApiResponse<Tenant>> =>
      this.post('/superadmin/tenants', data),

    // Update tenant
    updateTenant: (tenantId: string, data: UpdateTenantRequest): Promise<ApiResponse<Tenant>> =>
      this.patch(`/superadmin/tenants/${tenantId}`, data),

    // Delete tenant
    deleteTenant: (tenantId: string): Promise<ApiResponse<void>> =>
      this.delete(`/superadmin/tenants/${tenantId}`),

    // Activate tenant
    activateTenant: (tenantId: string): Promise<ApiResponse<Tenant>> =>
      this.post(`/superadmin/tenants/${tenantId}/activate`),

    // Suspend tenant
    suspendTenant: (tenantId: string): Promise<ApiResponse<Tenant>> =>
      this.post(`/superadmin/tenants/${tenantId}/suspend`),

    // Check if slug is available
    checkSlugAvailability: (slug: string): Promise<ApiResponse<{ available: boolean }>> =>
      this.get(`/superadmin/tenants/check-slug/${slug}`),

    // Get platform statistics
    getStats: (): Promise<ApiResponse<{
      totalTenants: number;
      activeTenants: number;
      totalOrders: number;
      totalRevenue: number;
    }>> => this.get('/superadmin/stats'),
  };

  // =========================================================================
  // Tenant API (Public - Customer Facing)
  // =========================================================================

  tenant = {
    // Get tenant info by slug (used for customer-facing pages)
    getBySlug: (slug: string): Promise<ApiResponse<Tenant>> =>
      this.get(`/tenants/${slug}`),

    // Get current tenant info (uses x-tenant-id header)
    getCurrent: (): Promise<ApiResponse<Tenant>> =>
      this.get('/tenant'),

    // Validate tenant status
    validateStatus: (): Promise<ApiResponse<{ valid: boolean; status: string }>> =>
      this.get('/tenant/validate'),
  };

  // =========================================================================
  // Menu API
  // =========================================================================

  menu = {
    // Get full menu (customer-facing)
    getMenu: (): Promise<ApiResponse<Menu>> =>
      this.get('/menu'),

    // Get single menu item
    getMenuItem: (itemId: string): Promise<ApiResponse<MenuItem>> =>
      this.get(`/menu/items/${itemId}`),

    // Get categories
    getCategories: (): Promise<ApiResponse<MenuCategory[]>> =>
      this.get('/menu/categories'),

    // Dashboard: Create category
    createCategory: (data: Omit<MenuCategory, 'id' | 'items'>): Promise<ApiResponse<MenuCategory>> =>
      this.post('/dashboard/menu/categories', data),

    // Dashboard: Update category
    updateCategory: (categoryId: string, data: Partial<MenuCategory>): Promise<ApiResponse<MenuCategory>> =>
      this.patch(`/dashboard/menu/categories/${categoryId}`, data),

    // Dashboard: Delete category
    deleteCategory: (categoryId: string): Promise<ApiResponse<void>> =>
      this.delete(`/dashboard/menu/categories/${categoryId}`),

    // Dashboard: Create menu item
    createItem: (data: Omit<MenuItem, 'id'>): Promise<ApiResponse<MenuItem>> =>
      this.post('/dashboard/menu/items', data),

    // Dashboard: Update menu item
    updateItem: (itemId: string, data: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> =>
      this.patch(`/dashboard/menu/items/${itemId}`, data),

    // Dashboard: Delete menu item
    deleteItem: (itemId: string): Promise<ApiResponse<void>> =>
      this.delete(`/dashboard/menu/items/${itemId}`),

    // Dashboard: Toggle item availability
    toggleAvailability: (itemId: string): Promise<ApiResponse<MenuItem>> =>
      this.post(`/dashboard/menu/items/${itemId}/toggle-availability`),
  };

  // =========================================================================
  // Orders API
  // =========================================================================

  orders = {
    // Create order (customer-facing)
    create: (data: {
      tableNumber?: string;
      customerName?: string;
      customerPhone?: string;
      items: { menuItemId: string; quantity: number; notes?: string }[];
      notes?: string;
    }): Promise<ApiResponse<Order>> =>
      this.post('/orders', data),

    // Get order by ID (customer tracking)
    getById: (orderId: string): Promise<ApiResponse<Order>> =>
      this.get(`/orders/${orderId}`),

    // Dashboard: List orders
    list: (filters?: {
      status?: OrderStatus;
      date?: string;
      page?: number;
      pageSize?: number;
    }): Promise<ApiResponse<Order[]>> => {
      const params = new URLSearchParams();
      if (filters?.status) params.set('status', filters.status);
      if (filters?.date) params.set('date', filters.date);
      if (filters?.page) params.set('page', filters.page.toString());
      if (filters?.pageSize) params.set('pageSize', filters.pageSize.toString());
      const query = params.toString();
      return this.get(`/dashboard/orders${query ? `?${query}` : ''}`);
    },

    // Dashboard: Update order status
    updateStatus: (orderId: string, status: OrderStatus): Promise<ApiResponse<Order>> =>
      this.patch(`/dashboard/orders/${orderId}/status`, { status }),

    // Dashboard: Get active orders
    getActive: (): Promise<ApiResponse<Order[]>> =>
      this.get('/dashboard/orders/active'),
  };

  // =========================================================================
  // Tables API
  // =========================================================================

  tables = {
    // Dashboard: List tables
    list: (): Promise<ApiResponse<Table[]>> =>
      this.get('/dashboard/tables'),

    // Dashboard: Create table
    create: (data: { number: string; capacity: number }): Promise<ApiResponse<Table>> =>
      this.post('/dashboard/tables', data),

    // Dashboard: Update table
    update: (tableId: string, data: Partial<Table>): Promise<ApiResponse<Table>> =>
      this.patch(`/dashboard/tables/${tableId}`, data),

    // Dashboard: Delete table
    delete: (tableId: string): Promise<ApiResponse<void>> =>
      this.delete(`/dashboard/tables/${tableId}`),

    // Dashboard: Generate QR code for table
    generateQR: (tableId: string): Promise<ApiResponse<{ qrCode: string }>> =>
      this.post(`/dashboard/tables/${tableId}/generate-qr`),
  };

  // =========================================================================
  // Dashboard API (Tenant Owner)
  // =========================================================================

  dashboard = {
    // Get dashboard statistics
    getStats: (): Promise<ApiResponse<DashboardStats>> =>
      this.get('/dashboard/stats'),

    // Get tenant settings
    getSettings: (): Promise<ApiResponse<Tenant>> =>
      this.get('/dashboard/settings'),

    // Update tenant settings
    updateSettings: (data: Partial<Tenant['settings']>): Promise<ApiResponse<Tenant>> =>
      this.patch('/dashboard/settings', data),

    // Update branding
    updateBranding: (data: Partial<Tenant['branding']>): Promise<ApiResponse<Tenant>> =>
      this.patch('/dashboard/branding', data),
  };

  // =========================================================================
  // Reservations API
  // =========================================================================

  reservations = {
    // Customer: Create reservation
    create: (data: {
      tableId: string;
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      partySize: number;
      dateTime: string;
      notes?: string;
    }): Promise<ApiResponse<Reservation>> =>
      this.post('/reservations', data),

    // Customer: Get reservation
    getById: (reservationId: string): Promise<ApiResponse<Reservation>> =>
      this.get(`/reservations/${reservationId}`),

    // Dashboard: List reservations
    list: (filters?: {
      date?: string;
      status?: string;
    }): Promise<ApiResponse<Reservation[]>> => {
      const params = new URLSearchParams();
      if (filters?.date) params.set('date', filters.date);
      if (filters?.status) params.set('status', filters.status);
      const query = params.toString();
      return this.get(`/dashboard/reservations${query ? `?${query}` : ''}`);
    },

    // Dashboard: Update reservation status
    updateStatus: (reservationId: string, status: string): Promise<ApiResponse<Reservation>> =>
      this.patch(`/dashboard/reservations/${reservationId}/status`, { status }),
  };
}

// ============================================================================
// Singleton Instance & Factory Functions
// ============================================================================

// Default client instance
let defaultClient: ApiClient | null = null;

/**
 * Get the default API client instance
 */
export function getApiClient(): ApiClient {
  if (!defaultClient) {
    defaultClient = new ApiClient();
  }
  return defaultClient;
}

/**
 * Create a new API client with specific tenant context
 * Useful for server components that need to make tenant-specific calls
 */
export function createTenantApiClient(tenantId: string, accessToken?: string): ApiClient {
  return new ApiClient({
    tenantId,
    accessToken,
  });
}

/**
 * Create a superadmin API client
 */
export function createSuperadminApiClient(accessToken: string): ApiClient {
  const client = new ApiClient({ accessToken });
  return client;
}

// Export the class for custom instantiation
export { ApiClient };
