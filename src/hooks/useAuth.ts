import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectIsAuthenticated, selectUser } from '../redux/slices/authSlice';
import { login, logout, checkAuthStatus } from '../redux/actions/authActions';
import { LoginRequest } from '../services/authService';

/**
 * Custom hook for authentication
 * Provides access to auth state and actions
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  /**
   * Login user
   */
  const loginUser = useCallback((
    credentials: LoginRequest,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    dispatch(login(credentials, onSuccess, onError));
  }, [dispatch]);

  /**
   * Logout user
   */
  const logoutUser = useCallback((
    onSuccess?: () => void
  ) => {
    dispatch(logout(onSuccess));
  }, [dispatch]);

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  /**
   * Get user ID
   */
  const getUserId = useCallback(() => {
    return user?.id || '';
  }, [user]);

  /**
   * Get access token
   */
  const getAccessToken = useCallback(() => {
    return user?.access_token || '';
  }, [user]);

  /**
   * Get user role
   */
  const getUserRole = useCallback(() => {
    return user?.role || '';
  }, [user]);

  /**
   * Get tenant ID
   */
  const getTenantId = useCallback(() => {
    return user?.tenant_id || '';
  }, [user]);

  /**
   * Get tenant slug
   */
  const getTenantSlug = useCallback(() => {
    return user?.tenant_slug || '';
  }, [user]);

  /**
   * Get tenant label
   */
  const getTenantLabel = useCallback(() => {
    return user?.tenant_label || '';
  }, [user]);

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback((role: string) => {
    return user?.role === role;
  }, [user]);

  return {
    isAuthenticated,
    user,
    loginUser,
    logoutUser,
    checkAuth,
    getUserId,
    getAccessToken,
    getUserRole,
    getTenantId,
    getTenantSlug,
    getTenantLabel,
    hasRole
  };
};

export default useAuth;
