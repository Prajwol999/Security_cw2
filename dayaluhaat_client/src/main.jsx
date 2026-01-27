// React
import React from 'react';
import { createRoot } from 'react-dom/client';

// Third Party
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Internal
import AuthContextProvider from './auth/AuthProvider';
import App from './App';
import './index.css';

const queryClient = new QueryClient();
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);



// Render the application.
root.render(
  <Router>
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            // Default options for all toasts
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#1F2937',
              padding: '16px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            },
            // Success toast styling
            success: {
              duration: 4000,
              style: {
                background: '#FEE2E2',
                color: '#7F1D1D',
                border: '2px solid #E31E24',
              },
              iconTheme: {
                primary: '#E31E24',
                secondary: '#FFFFFF',
              },
            },
            // Error toast styling
            error: {
              duration: 5000,
              style: {
                background: '#FEE2E2',
                color: '#7F1D1D',
                border: '2px solid #DC2626',
              },
              iconTheme: {
                primary: '#DC2626',
                secondary: '#FFFFFF',
              },
            },
            // Loading toast styling
            loading: {
              style: {
                background: '#F3F4F6',
                color: '#1F2937',
                border: '2px solid #9CA3AF',
              },
            },
          }}
        />
      </QueryClientProvider>
    </AuthContextProvider>
  </Router>
);

