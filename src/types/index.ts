export type Role = 'ADMIN' | 'STAFF';
export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  _count?: { products: number };
}

export interface Supplier {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  _count?: { products: number };
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  price: string | number;
  costPrice: string | number;
  quantity: number;
  reorderLevel: number;
  categoryId?: string | null;
  supplierId?: string | null;
  category?: { id: string; name: string } | null;
  supplier?: { id: string; name: string } | null;
  movements?: StockMovement[];
  createdAt: string;
}

export interface StockMovement {
  id: string;
  type: MovementType;
  quantity: number;
  note?: string | null;
  createdAt: string;
  product?: { id: string; name: string; sku: string };
  user?: { id: string; name: string } | null;
}

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PageMeta & Record<string, unknown>;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalStock: number;
  inventoryValue: number;
  lowStockCount: number;
  lowStockProducts: Product[];
  recentMovements: StockMovement[];
}
