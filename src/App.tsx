import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { StoreDashboard } from './features/store/components/StoreDashboard';
import { InventoryDashboard } from './features/inventory/components/InventoryDashboard';
import { POSDashboard } from './features/pos/components/POSDashboard';
import { AccountingDashboard } from './features/accounting/components/AccountingDashboard';
import { MarketingDashboard } from './features/marketing/components/MarketingDashboard';
import { ConfigDashboard } from './features/config/components/ConfigDashboard';
import { useAuthStore } from './stores/auth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/app" /> : <Landing />
        } />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/app" /> : <Login />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/app" /> : <Register />
        } />

        {/* Protected routes */}
        <Route path="/app" element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route index element={<Home />} />
          <Route path="store" element={<StoreDashboard />} />
          <Route path="inventory" element={<InventoryDashboard />} />
          <Route path="pos" element={<POSDashboard />} />
          <Route path="accounting" element={<AccountingDashboard />} />
          <Route path="marketing" element={<MarketingDashboard />} />
          <Route path="settings" element={<ConfigDashboard />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}