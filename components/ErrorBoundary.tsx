'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In production, you might want to send this to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to your error tracking service
      // e.g., Sentry, LogRocket, etc.
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-lg">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Something went wrong</h2>
              <p className="mt-2 text-sm text-gray-600">
                We&apos;ve encountered an unexpected error.
              </p>
              {this.state.error && process.env.NODE_ENV !== 'production' && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg text-left">
                  <p className="text-sm font-medium text-red-800">Error:</p>
                  <pre className="mt-2 text-xs text-red-800 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </div>
              )}
            </div>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-color1 hover:bg-color2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-color1"
              >
                Refresh the page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-color1"
              >
                Return to home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 