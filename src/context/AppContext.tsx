
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { reducer, initialState, State, Action, TenantDetails } from '../types/dispatcherTypes';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../config/environment';
import apiRequest from '../utils/httpClient';
import { TENANTS } from '../constants/apiEndpoints';

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

      // If authenticated, set login success but don't redirect
      if (authToken) {
        dispatch({ type: 'LOGIN_SUCCESS' });
      }
    }
  }, [navigate]);

  // Check if tenant exists
  const checkTenantExists = async (slug: string): Promise<boolean> => {
    try {
      dispatch({ type: 'FETCH_START' });

      const data = await apiRequest({
        url: TENANTS.GET_TENANT_ID,
        method: 'GET',
        params: { slug },
        callbacks: {
          successCallback: (response) => {
            const tenantDetails: TenantDetails = {
              tenant_id: response.tenant_id,
              name: response.tenant_name || slug,
              slug: slug
            };

            // Store tenant details in localStorage and context
            localStorage.setItem(API_CONFIG.TENANT_DETAILS_KEY, JSON.stringify(tenantDetails));
            dispatch({ type: 'SET_TENANT', payload: tenantDetails });
          },
          failureCallback: (error) => {
            console.error("Error fetching tenant:", error);
            dispatch({
              type: 'FETCH_ERROR',
              payload: error instanceof Error ? error.message : 'Failed to fetch tenant'
            });
          }
        }
      });

      return true;
    } catch (error) {
      console.error("Error fetching tenant:", error);
      return false;
    }
  };

  // Login user
  const loginUser = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      dispatch({ type: 'LOGIN_SUCCESS' });
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
