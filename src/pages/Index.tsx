
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Check if tenant slug exists in localStorage
  const tenantDetails = localStorage.getItem('tenantDetails');
  const authToken = localStorage.getItem('authToken');
  
  if (tenantDetails) {
    const tenant = JSON.parse(tenantDetails);
    
    // If authenticated, go to dashboard, else go to login
    if (authToken) {
      return <Navigate to={`/${tenant.slug}/dashboard`} replace />;
    } else {
      return <Navigate to={`/${tenant.slug}/login`} replace />;
    }
  }
  
  // If no tenant in localStorage, go to 404
  return <Navigate to="/404" replace />;
};

export default Index;
