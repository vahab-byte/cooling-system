import React from 'react';
import AppRoutes from './AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
