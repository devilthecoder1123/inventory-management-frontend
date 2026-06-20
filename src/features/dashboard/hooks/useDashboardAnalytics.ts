import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';

/** Fetches dashboard analytics for the given trailing window (days). */
export function useDashboardAnalytics(days = 30) {
  return useQuery({
    queryKey: ['dashboard', 'analytics', days],
    queryFn: () => dashboardApi.analytics(days),
    staleTime: 30_000,
  });
}
