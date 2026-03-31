// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient ,QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
// import queryClient from '../src/main';

// Auth pages
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ChangePasswordPage from './components/auth/ChangePasswordPage';

// Protected pages
import DashboardPage from './components/dashboard/DashboardPage';
import ProfilePage from './components/profile/ProfilePage';
// import CompanyProfilePage from './components/profile/CompanyProfilePage';

// Project pages
import ProjectListPage from './components/projects/ProjectListPage';
import ProjectDetailPage from './components/projects/ProjectDetailPage';
import ProjectFormPage from './components/projects/ProjectFormPage';

// Quotation pages 
import QuotationListPage from './components/quotations/QuotationListPage';
import QuotationFormPage from './components/quotations/QuotationFormPage';
import QuotationDetailPage from './components/quotations/QuotationDetailPage';
import QuotationEditPage from './components/quotations/QuotationEditPage';

// Commande pages
import CommandeListPage from './components/commandes/CommandeListPage';
import CommandeDetailPage from './components/commandes/CommandeDetailPage';

// Facture pages
import FactureListPage from './components/factures/FactureListPage';
import FactureDetailPage from './components/factures/FactureDetailPage';

import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { UpdateAvailable } from './components/UpdateAvailable';

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-neutral-600">Chargement...</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public route wrapper (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Professional only route
const ProfessionalRoute = ({ children }) => {
  const { isProfessionnel, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isProfessionnel) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <>
    <OfflineIndicator />
     {/* <UpdateAvailable /> */}
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/company" 
        element={
          <ProtectedRoute>
            <ProfessionalRoute>
              {/* <CompanyProfilePage /> */}
            </ProfessionalRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/security" 
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Project routes */}
      <Route 
        path="/projects" 
        element={
          <ProtectedRoute>
            <ProjectListPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects/create" 
        element={
          <ProtectedRoute>
            <ProjectFormPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects/:id" 
        element={
          <ProtectedRoute>
            <ProjectDetailPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects/:id/edit" 
        element={
          <ProtectedRoute>
            <ProjectFormPage />
          </ProtectedRoute>
        } 
      />

      {/* Quotation routes */}
      <Route
        path="/quotations"
        element={
          <ProtectedRoute>
            <QuotationListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quotations/create"
        element={
          <ProtectedRoute>
            <QuotationFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quotations/:id"
        element={
          <ProtectedRoute>
            <QuotationDetailPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/quotations/:id/edit" 
        element={
          <ProtectedRoute>
            <QuotationEditPage />
          </ProtectedRoute>
        } 
      />

      {/* Commande routes */}
      <Route
        path="/commandes"
        element={
          <ProtectedRoute>
            <CommandeListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commandes/:id"
        element={
          <ProtectedRoute>
            <CommandeDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Facture routes */}
      <Route
        path="/factures"
        element={
          <ProtectedRoute>
            <FactureListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/factures/:id"
        element={
          <ProtectedRoute>
            <FactureDetailPage />
          </ProtectedRoute>
        }
      />
      
      {/* Redirect root to dashboard or login */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    <PWAInstallBanner />
    </>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;