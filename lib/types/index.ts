// ============================================================================
// DineOS - Core Type Definitions
// ============================================================================

// Tenant Types
export interface Tenant {
  id: string;
  slug: string; // subdomain identifier (e.g., "burgerhouse")
  name: string; // display name (e.g., "Burger House Nepal")
  ownerEmail: string;
  status: TenantStatus;
  settings: TenantSettings;
  branding: TenantBranding;
  createdAt: string;
  updatedAt: string;
}

export type TenantStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface TenantSettings {
  currency: string;
  timezone: string;
  language: string;
  orderingEnabled: boolean;
  reservationsEnabled: boolean;
  deliveryEnabled: boolean;
  taxRate: number;
}

export interface TenantBranding {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily?: string;
}

// Menu Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  allergens: string[];
  tags: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  imageUrl?: string;
  items: MenuItem[];
}

export interface Menu {
  id: string;
  tenantId: string;
  categories: MenuCategory[];
  lastUpdated: string;
}

// Order Types
export interface Order {
  id: string;
  tenantId: string;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  modifiers?: OrderItemModifier[];
}

export interface OrderItemModifier {
  name: string;
  price: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'completed'
  | 'cancelled';

// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string; // null for superadmin
  createdAt: string;
}

export type UserRole = 'superadmin' | 'tenant_owner' | 'tenant_admin' | 'tenant_staff';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
}

// Superadmin Types
export interface CreateTenantRequest {
  name: string;
  slug: string;
  ownerEmail: string;
  ownerName: string;
  settings?: Partial<TenantSettings>;
  branding?: Partial<TenantBranding>;
}

export interface UpdateTenantRequest {
  name?: string;
  status?: TenantStatus;
  settings?: Partial<TenantSettings>;
  branding?: Partial<TenantBranding>;
}

export interface TenantListFilters {
  status?: TenantStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

// Table & Reservation Types
export interface Table {
  id: string;
  tenantId: string;
  number: string;
  capacity: number;
  qrCode: string;
  status: TableStatus;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'inactive';

export interface Reservation {
  id: string;
  tenantId: string;
  tableId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  partySize: number;
  dateTime: string;
  status: ReservationStatus;
  notes?: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';

// Analytics Types
export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  activeOrders: number;
  averageOrderValue: number;
  popularItems: { itemName: string; count: number }[];
  revenueByHour: { hour: number; revenue: number }[];
}
