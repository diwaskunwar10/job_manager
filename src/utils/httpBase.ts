
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Dispatch } from 'react';
import { Action } from '../types/dispatcherTypes';
import { API_CONFIG } from '../config/environment';

// Create axios instance using the environment configuration
const httpClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Get tenant details from localStorage
    const tenantDetails = localStorage.getItem(API_CONFIG.TENANT_DETAILS_KEY);
    const tenant = tenantDetails ? JSON.parse(tenantDetails) : null;
    const slug = localStorage.getItem('aroma_slug');

    // Add tenant_id and slug as query params if available
    if (tenant && tenant.tenant_id) {
      config.params = {
        ...config.params,
        tenant_id: tenant.tenant_id,
        client_id: slug || 'string'
      };
    }

    // Add authorization header if token exists
    const token = localStorage.getItem(API_CONFIG.AUTH_TOKEN_KEY);
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
      // Do not remove the auth token as requested
      // Just get tenant slug and redirect to login
      const tenantDetails = localStorage.getItem(API_CONFIG.TENANT_DETAILS_KEY);
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
