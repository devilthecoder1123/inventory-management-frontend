import { api } from '../lib/api';
import type {
  ApiResponse,
  Category,
  DashboardStats,
  Product,
  StockMovement,
  Supplier,
  User,
} from '../types';

// ---- Auth ----
export const authApi = {
  login: (body: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', body).then((r) => r.data.data),
  register: (body: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', body).then((r) => r.data.data),
  me: () => api.get<ApiResponse<User>>('/auth/me').then((r) => r.data.data),
};

// ---- Products ----
export interface ProductQuery {
  search?: string;
  categoryId?: string;
  supplierId?: string;
  lowStock?: boolean;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const productApi = {
  list: (params: ProductQuery) =>
    api.get<ApiResponse<Product[]>>('/products', { params }).then((r) => r.data),
  get: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`).then((r) => r.data.data),
  create: (body: Partial<Product>) =>
    api.post<ApiResponse<Product>>('/products', body).then((r) => r.data.data),
  update: (id: string, body: Partial<Product>) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, body).then((r) => r.data.data),
  remove: (id: string) => api.delete<ApiResponse<null>>(`/products/${id}`).then((r) => r.data),
};

// ---- Categories ----
export const categoryApi = {
  list: () => api.get<ApiResponse<Category[]>>('/categories').then((r) => r.data.data),
  create: (body: Partial<Category>) =>
    api.post<ApiResponse<Category>>('/categories', body).then((r) => r.data.data),
  update: (id: string, body: Partial<Category>) =>
    api.put<ApiResponse<Category>>(`/categories/${id}`, body).then((r) => r.data.data),
  remove: (id: string) => api.delete<ApiResponse<null>>(`/categories/${id}`).then((r) => r.data),
};

// ---- Suppliers ----
export const supplierApi = {
  list: () => api.get<ApiResponse<Supplier[]>>('/suppliers').then((r) => r.data.data),
  create: (body: Partial<Supplier>) =>
    api.post<ApiResponse<Supplier>>('/suppliers', body).then((r) => r.data.data),
  update: (id: string, body: Partial<Supplier>) =>
    api.put<ApiResponse<Supplier>>(`/suppliers/${id}`, body).then((r) => r.data.data),
  remove: (id: string) => api.delete<ApiResponse<null>>(`/suppliers/${id}`).then((r) => r.data),
};

// ---- Stock movements ----
export interface MovementQuery {
  productId?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export const stockApi = {
  list: (params: MovementQuery) =>
    api.get<ApiResponse<StockMovement[]>>('/stock-movements', { params }).then((r) => r.data),
  create: (body: { productId: string; type: string; quantity: number; note?: string }) =>
    api.post<ApiResponse<StockMovement>>('/stock-movements', body).then((r) => r.data.data),
};

// ---- Dashboard ----
export const dashboardApi = {
  stats: () => api.get<ApiResponse<DashboardStats>>('/dashboard/stats').then((r) => r.data.data),
};
