import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Dispatch } from 'react';
import { Action } from '../types/dispatcherTypes';

// Base API URL
export const API_BASE_URL = 'https://36e2-2400-1a00-b030-7824-6a6c-791a-70da-9afe.ngrok-free.app';

// Create axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Get tenant details from localStorage
    const tenantDetails = localStorage.getItem('tenantDetails');
    const tenant = tenantDetails ? JSON.parse(tenantDetails) : null;

    // Add tenant_id as a query param if available
    if (tenant && tenant.tenant_id) {
      config.params = {
        ...config.params,
        tenant_id: tenant.tenant_id
      };
    }

    // Add authorization header if token exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle auth errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear localStorage
      localStorage.removeItem('authToken');
      
      // Get tenant slug
      const tenantDetails = localStorage.getItem('tenantDetails');
      const tenant = tenantDetails ? JSON.parse(tenantDetails) : null;
      
      if (tenant && tenant.slug) {
        // Create an error with a special message that can be detected
        const authError = new Error(`401: Unauthorized - Session expired`);
        return Promise.reject(authError);
      }
    }
    
    return Promise.reject(error);
  }
);

// HTTP base methods with dispatcher integration
export const httpBase = {
  get: async <T = any>(
    url: string, 
    config?: AxiosRequestConfig, 
    dispatch?: Dispatch<Action>
  ): Promise<T> => {
    if (dispatch) dispatch({ type: 'FETCH_START' });
    
    try {
      const response = await httpClient.get<T>(url, config);
      if (dispatch) dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message 
        ? error.response.data.message 
        : 'An unexpected error occurred';
      
      if (dispatch) dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      throw error;
    }
  },
  
  post: async <T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig, 
    dispatch?: Dispatch<Action>
  ): Promise<T> => {
    if (dispatch) dispatch({ type: 'FETCH_START' });
    
    try {
      const response = await httpClient.post<T>(url, data, config);
      if (dispatch) dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message 
        ? error.response.data.message 
        : 'An unexpected error occurred';
      
      if (dispatch) dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      throw error;
    }
  },
  
  put: async <T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig, 
    dispatch?: Dispatch<Action>
  ): Promise<T> => {
    if (dispatch) dispatch({ type: 'FETCH_START' });
    
    try {
      const response = await httpClient.put<T>(url, data, config);
      if (dispatch) dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message 
        ? error.response.data.message 
        : 'An unexpected error occurred';
      
      if (dispatch) dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      throw error;
    }
  },
  
  delete: async <T = any>(
    url: string, 
    config?: AxiosRequestConfig, 
    dispatch?: Dispatch<Action>
  ): Promise<T> => {
    if (dispatch) dispatch({ type: 'FETCH_START' });
    
    try {
      const response = await httpClient.delete<T>(url, config);
      if (dispatch) dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message 
        ? error.response.data.message 
        : 'An unexpected error occurred';
      
      if (dispatch) dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      throw error;
    }
  }
};
