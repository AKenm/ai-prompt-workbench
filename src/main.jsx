import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background dark:bg-slate-950 p-8 text-center" role="alert">
          <span className="inline-flex items-center gap-1 rounded-md bg-red-100 dark:bg-red-900 px-2 py-0.5 text-xs font-bold text-red-700 dark:text-red-300">
            应用错误
          </span>
          <h2 className="text-xl font-bold text-text dark:text-slate-100">页面发生了意外错误</h2>
          <p className="text-sm text-text-secondary dark:text-slate-400 max-w-md">
            {this.state.error?.message || '未知错误'}
          </p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload(); }}
            className="rounded-lg bg-primary dark:bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark dark:hover:bg-indigo-500"
          >
            刷新页面
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
