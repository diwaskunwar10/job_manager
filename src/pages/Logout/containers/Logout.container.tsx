import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import LogoutComponent from '../components/Logout.component';
import { API_CONFIG } from '../../../config/environment';

/**
 * Logout Container Component
 *
 * This component handles the logout process logic and state management.
 */
const LogoutContainer: React.FC = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Get tenant slug directly from localStorage to ensure it's available after logout
    const tenantSlug = localStorage.getItem(API_CONFIG.TENANT_SLUG_KEY) ||
                      localStorage.getItem('aroma_tenant_slug') || '';

    // Perform logout
    logoutUser(() => {
      // Redirect to login page with tenant slug
      navigate(`/${tenantSlug}/login`);
    });
  }, [logoutUser, navigate]);

  return <LogoutComponent />;
};

export default LogoutContainer;
