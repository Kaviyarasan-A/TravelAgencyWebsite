import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <HelmetProvider>
                <BrowserRouter>
                    <App />
                    <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            borderRadius: '14px',
                            background: '#0b0f1a',
                            color: '#fff',
                            fontSize: '14px',
                            padding: '12px 16px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                        },
                        success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
                        error:   { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
                    }}
                />
                </BrowserRouter>
            </HelmetProvider>
        </ErrorBoundary>
    </React.StrictMode>,
);
