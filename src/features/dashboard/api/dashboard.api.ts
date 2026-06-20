import { api } from '../../../lib/api';
import type { ApiResponse } from '../../../types';
import type { DashboardAnalytics } from '../types';

export const dashboardApi = {
  analytics: (days = 30) =>
    api
      .get<ApiResponse<DashboardAnalytics>>('/dashboard/analytics', { params: { days } })
      .then((r) => r.data.data),
};
