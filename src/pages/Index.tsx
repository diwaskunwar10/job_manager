
import React from 'react';
import { Navigate } from 'react-router-dom';
import { API_CONFIG } from '../config/environment';

const Index = () => {
  // Check if tenant slug exists in localStorage
  const tenantDetails = localStorage.getItem(API_CONFIG.TENANT_DETAILS_KEY);
  const authToken = localStorage.getItem(API_CONFIG.AUTH_TOKEN_KEY);

  if (tenantDetails) {
    const tenant = JSON.parse(tenantDetails);

    // Always go to login page, don't automatically redirect to dashboard
    return <Navigate to={`/${tenant.slug}/login`} replace />;
  }

  // If no tenant in localStorage, go to 404
  return <Navigate to="/404" replace />;
};

export default Index;
