
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { reducer, initialState, State, Action, TenantDetails } from '../types/dispatcherTypes';
import { useNavigate } from 'react-router-dom';

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
    const tenantDetails = localStorage.getItem('tenantDetails');
    const authToken = localStorage.getItem('authToken');
    
    if (tenantDetails) {
      dispatch({ type: 'SET_TENANT', payload: JSON.parse(tenantDetails) });
    }
    
    if (authToken) {
      dispatch({ type: 'LOGIN_SUCCESS' });
    }
  }, []);

  // Check if tenant exists
  const checkTenantExists = async (slug: string): Promise<boolean> => {
    try {
      dispatch({ type: 'FETCH_START' });
      
      const response = await fetch(
        `https://36e2-2400-1a00-b030-7824-6a6c-791a-70da-9afe.ngrok-free.app/get_tenant_id?slug=${slug}`
      );
      
      if (!response.ok) {
        throw new Error('Invalid tenant');
      }
      
      const data = await response.json();
      
      const tenantDetails: TenantDetails = {
        tenant_id: data.tenant_id,
        name: data.name,
        slug: slug
      };
      
      // Store tenant details in localStorage and context
      localStorage.setItem('tenantDetails', JSON.stringify(tenantDetails));
      dispatch({ type: 'SET_TENANT', payload: tenantDetails });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
      
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
      
      // Store auth token
      localStorage.setItem('authToken', 'dummy-auth-token');
      dispatch({ type: 'LOGIN_SUCCESS' });
      
      // Redirect to dashboard
      const tenantDetails = localStorage.getItem('tenantDetails');
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
    // Clear auth token
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
    
    // Redirect to login
    const tenantDetails = localStorage.getItem('tenantDetails');
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
