import { AlertTriangle } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
}

/** Catches render-time errors in its subtree and shows a recoverable fallback. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-danger-50 text-danger-600">
          <AlertTriangle size={22} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Something went wrong</h2>
          <p className="mt-1 max-w-sm text-sm text-neutral-500">
            {this.state.error?.message ?? 'An unexpected error occurred while rendering this view.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Reload
          </Button>
          <Button onClick={this.handleReset}>Try again</Button>
        </div>
      </div>
    );
  }
}
