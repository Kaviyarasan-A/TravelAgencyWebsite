import { Component } from 'react';
import { BRAND } from '../data.js';

/**
 * Top-level error boundary. Catches render-time errors from lazy chunks
 * and child trees so the whole page doesn't white-screen. Offers a
 * Reload + Home button and shows the stack in development only.
 */
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error('[error-boundary]', error, info);
    }

    render() {
        if (!this.state.error) return this.props.children;
        const isDev = import.meta.env.DEV;
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
                <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 text-3xl">!</div>
                    <h1 className="font-display text-2xl font-extrabold text-ink">Something broke</h1>
                    <p className="text-ink-muted text-sm mt-2">
                        A page error was caught before it could crash the site. You can try reloading,
                        or head back to the homepage.
                    </p>
                    {isDev && (
                        <pre className="text-[11px] text-left text-red-600 bg-red-50 rounded-xl p-3 mt-4 overflow-auto max-h-40">
                            {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
                        </pre>
                    )}
                    <div className="flex gap-2 justify-center mt-5">
                        <button onClick={() => window.location.reload()} className="btn-sm rounded-xl bg-brand-500 text-white hover:bg-brand-600">Reload</button>
                        <a href="/" className="btn-sm rounded-xl bg-slate-100 text-ink hover:bg-slate-200">Home</a>
                        <a href={`mailto:${BRAND.email}?subject=Site error`} className="btn-sm rounded-xl bg-slate-100 text-ink hover:bg-slate-200">Report</a>
                    </div>
                </div>
            </div>
        );
    }
}
