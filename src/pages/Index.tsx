
import React from 'react';
import { Navigate } from 'react-router-dom';
import { API_CONFIG } from '../config/environment';
import { useAppSelector } from '../redux/hooks';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

const Index = () => {
  // Check if tenant slug exists in localStorage
  const tenantSlug = localStorage.getItem('aroma_tenant_slug') || localStorage.getItem(API_CONFIG.TENANT_SLUG_KEY);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (tenantSlug) {
    // Check if user is already authenticated
    if (isAuthenticated) {
      // If authenticated, go directly to dashboard
      return <Navigate to={`/${tenantSlug}/dashboard`} replace />;
    } else {
      // If not authenticated, go to login page
      return <Navigate to={`/${tenantSlug}/login`} replace />;
    }
  }

  // If no tenant slug in localStorage, go to 404
  return <Navigate to="/404" replace />;
};

export default Index;
