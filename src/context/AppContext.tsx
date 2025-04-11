
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { reducer, initialState, State, Action, TenantDetails } from '../types/dispatcherTypes';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../config/environment';
import { httpBase } from '../utils/httpBase';

interface AppContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
  checkTenantExists: (slug: string) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  // Load tenant data from localStorage on initial load
  useEffect(() => {
    const tenantDetails = localStorage.getItem(API_CONFIG.TENANT_DETAILS_KEY);
    const authToken = localStorage.getItem(API_CONFIG.AUTH_TOKEN_KEY);
    
    if (tenantDetails) {
      dispatch({ type: 'SET_TENANT', payload: JSON.parse(tenantDetails) });
      
      // If authenticated, redirect to dashboard
      if (authToken) {
        dispatch({ type: 'LOGIN_SUCCESS' });
        const tenant = JSON.parse(tenantDetails);
        navigate(`/${tenant.slug}/dashboard`);
      }
    }
  }, [navigate]);

  // Check if tenant exists
  const checkTenantExists = async (slug: string): Promise<boolean> => {
    try {
      dispatch({ type: 'FETCH_START' });
      
      // Use the new API config and httpBase utility
      const data = await httpBase.get(`/get_tenant_id?slug=${slug}`, undefined, dispatch);
      
      const tenantDetails: TenantDetails = {
        tenant_id: data.tenant_id,
        name: data.tenant_name || slug, // Use tenant_name from response or fallback to slug
        slug: slug
      };
      
      // Store tenant details in localStorage and context
      localStorage.setItem(API_CONFIG.TENANT_DETAILS_KEY, JSON.stringify(tenantDetails));
      dispatch({ type: 'SET_TENANT', payload: tenantDetails });
      
      return true;
    } catch (error) {
      console.error("Error fetching tenant:", error);
      dispatch({ 
        type: 'FETCH_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch tenant'
      });
      return false;
    }
  };

  // Login user
  const loginUser = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      
      // In a real app, you'd call an API endpoint here
      // For demo purposes, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store auth token with the new key name
      localStorage.setItem(API_CONFIG.AUTH_TOKEN_KEY, 'dummy-auth-token');
      dispatch({ type: 'LOGIN_SUCCESS' });
      
      // Redirect to dashboard
      const tenantDetails = localStorage.getItem(API_CONFIG.TENANT_DETAILS_KEY);
      if (tenantDetails) {
        const tenant = JSON.parse(tenantDetails);
        navigate(`/${tenant.slug}/dashboard`);
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch({ 
        type: 'FETCH_ERROR', 
        payload: error instanceof Error ? error.message : 'Login failed'
      });
      throw error;
    }
  };

  // Logout user
  const logoutUser = () => {
    // Clear auth token with the new key name
    localStorage.removeItem(API_CONFIG.AUTH_TOKEN_KEY);
    dispatch({ type: 'LOGOUT' });
    
    // Redirect to login
    const tenantDetails = localStorage.getItem(API_CONFIG.TENANT_DETAILS_KEY);
    if (tenantDetails) {
      const tenant = JSON.parse(tenantDetails);
      navigate(`/${tenant.slug}/login`);
    } else {
      navigate('/');
    }
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch,
      checkTenantExists,
      loginUser,
      logoutUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
