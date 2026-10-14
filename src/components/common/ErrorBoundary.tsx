import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ShieldAlert, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
  key?: React.Key;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Enterprise-Grade React Error Boundary
 * Prevents localized runtime rendering crashes from taking down the entire web application tree.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  public props: Props;
  public state: State;
  public setState!: (
    updater: Partial<State> | ((prevState: State) => Partial<State>),
    callback?: () => void
  ) => void;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary intercepted unhandled failure:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-amber-500/30 text-slate-100 max-w-xl mx-auto my-12 shadow-2xl space-y-6 animate-fade-in font-sans text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-7 h-7 animate-pulse" />
          </div>

          <div className="space-y-3 relative z-10">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Something went wrong.
            </h3>
            <p className="text-sm text-slate-300 font-light leading-relaxed max-w-md mx-auto">
              Please try again. If the problem continues, contact your Regional Council for administrative assistance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 relative z-10">
            <button
              onClick={this.handleReset}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-black transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
