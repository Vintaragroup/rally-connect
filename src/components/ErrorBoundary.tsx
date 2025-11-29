import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🔴 ErrorBoundary caught error:", error, errorInfo);
    
    // Log to monitoring service (e.g., Sentry, LogRocket, etc.)
    // In production, you'd send this to your error tracking service:
    // logErrorToService(error, errorInfo);
    
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-8 max-w-md w-full shadow-lg">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-center mb-2">Oops! Something went wrong</h1>
            <p className="text-[var(--color-text-secondary)] text-center mb-6">
              We encountered an unexpected error. Our team has been notified and we're working to fix it.
            </p>

            {/* Error Details (development only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-h-40 overflow-auto">
                <p className="text-xs font-mono text-red-700 whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={this.handleReset}
                className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Return Home
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-[var(--color-border)]"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>

            {/* Error ID for support */}
            <p className="text-xs text-[var(--color-text-secondary)] text-center mt-4">
              Error ID: {Date.now()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
