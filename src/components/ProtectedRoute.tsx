import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectIsAuthenticated } from '../redux/slices/authSlice';
import { checkAuthStatus } from '../redux/actions/authActions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(state => state.auth.user);
  
  // Check authentication status on mount
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Extract tenant slug from URL
    const pathParts = location.pathname.split('/');
    const tenantSlug = pathParts.length > 1 ? pathParts[1] : '';
    
    return <Navigate to={`/${tenantSlug}/login`} state={{ from: location }} replace />;
  }
  
  // If role is required and user doesn't have it, redirect to dashboard
  if (requiredRole && user && user.role !== requiredRole) {
    // Extract tenant slug from URL
    const pathParts = location.pathname.split('/');
    const tenantSlug = pathParts.length > 1 ? pathParts[1] : '';
    
    return <Navigate to={`/${tenantSlug}/dashboard`} state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
