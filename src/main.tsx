import { StrictMode, Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
  retryCount: number;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, retryCount: 0 };

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application error:', error, info.componentStack);
    // Auto-retry once (handles race conditions on rapid refresh)
    if (this.state.retryCount < 1) {
      this.setState((s) => ({ hasError: false, retryCount: s.retryCount + 1 }));
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong</h1>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>An unexpected error occurred.</p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '0.75rem 1.5rem', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  const msg = document.createElement('p');
  msg.textContent = 'Failed to find root element. Please refresh the page.';
  msg.style.cssText = 'min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a1a;color:#e2e8f0;font-family:system-ui,sans-serif;margin:0';
  document.body.appendChild(msg);
  throw new Error('Root element not found');
}

createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
