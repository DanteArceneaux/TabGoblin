/**
 * Error Boundary component
 * Catches React errors and shows a fallback UI
 */

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Tab Goblin Error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm text-center text-white">
            <div className="text-5xl mb-4">😴</div>
            <h2 className="text-xl font-bold mb-2">Goblin is sleeping...</h2>
            <p className="text-gray-400 mb-4 text-sm">
              Something went wrong. Don't worry, your goblin's progress is saved!
            </p>
            <button
              onClick={this.handleRetry}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold"
            >
              Wake Up Goblin
            </button>
            {this.state.error && (
              <p className="mt-4 text-xs text-gray-500 font-mono break-all">
                {this.state.error.message}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

