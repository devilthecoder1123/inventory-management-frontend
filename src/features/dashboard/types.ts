import type { StockMovement } from '../../types';

export type HealthRating = 'excellent' | 'good' | 'fair' | 'poor';
export type AlertSeverity = 'out' | 'low';

export interface DashboardSummary {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalStock: number;
  inventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface HealthScore {
  score: number;
  rating: HealthRating;
  breakdown: { healthy: number; low: number; out: number };
}

export interface TrendPoint {
  date: string;
  stockIn: number;
  stockOut: number;
  netUnits: number;
  value: number;
}

export interface MoverProduct {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  unitsOut: number;
}

export interface CriticalAlert {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  severity: AlertSeverity;
}

export interface CategoryDatum {
  id: string | null;
  name: string;
  productCount: number;
  stockValue: number;
}

export interface SupplierDatum {
  id: string;
  name: string;
  productCount: number;
  stockValue: number;
}

export interface DashboardAnalytics {
  generatedAt: string;
  windowDays: number;
  summary: DashboardSummary;
  health: HealthScore;
  trends: { days: number; series: TrendPoint[] };
  fastMovers: MoverProduct[];
  slowMovers: MoverProduct[];
  criticalAlerts: CriticalAlert[];
  categoryDistribution: CategoryDatum[];
  topSuppliers: SupplierDatum[];
  recentMovements: StockMovement[];
}
