import { ErrorBoundary } from '../components/ErrorBoundary';
import { DashboardPage } from '../features/dashboard/DashboardPage';

export default function Dashboard() {
  return (
    <ErrorBoundary>
      <DashboardPage />
    </ErrorBoundary>
  );
}
