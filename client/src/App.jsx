import React from 'react';
import AppRoutes from './AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <Toaster position="top-right" />
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
