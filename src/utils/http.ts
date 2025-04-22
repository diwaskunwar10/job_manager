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

// Types for callback functions
export interface ApiCallbacks {
  finalCallback?: () => void;
  successCallback?: (response: any) => void;
  failureCallback?: (error: any) => void;
}

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Add authorization header if token exists
    // First try to get token from localStorage using the aroma_access_token key
    let token = localStorage.getItem('aroma_access_token');

    // If not found, try the API_CONFIG.AUTH_TOKEN_KEY for backward compatibility
    if (!token) {
      token = localStorage.getItem(API_CONFIG.AUTH_TOKEN_KEY);
    }

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
      // Get tenant slug from localStorage
      let tenantSlug = localStorage.getItem('aroma_tenant_slug');

      // If not found, try to get from tenant details for backward compatibility
      if (!tenantSlug) {
        const tenantDetails = localStorage.getItem(API_CONFIG.TENANT_DETAILS_KEY);
        const tenant = tenantDetails ? JSON.parse(tenantDetails) : null;
        tenantSlug = tenant?.slug;
      }

      if (tenantSlug) {
        // Create an error with a special message that can be detected
        const authError = new Error(`401: Unauthorized - Session expired`);
        // Add a custom property to the error for easier detection
        (authError as any).isAuthError = true;
        (authError as any).tenantSlug = tenantSlug;
        return Promise.reject(authError);
      }
    }

    return Promise.reject(error);
  }
);

// HTTP methods with dispatcher integration
export const http = {
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
  },

  // Advanced request function with callbacks
  request: async <T = any>({
    url,
    method,
    params,
    data,
    config = {},
    callbacks
  }: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: Record<string, any>;
    data?: any;
    config?: AxiosRequestConfig;
    callbacks?: ApiCallbacks;
  }): Promise<T> => {
    try {
      let response;
      const requestConfig = {
        ...config,
        params: { ...params }
      };

      switch (method) {
        case 'GET':
          response = await httpClient.get<T>(url, requestConfig);
          break;
        case 'POST':
          response = await httpClient.post<T>(url, data, requestConfig);
          break;
        case 'PUT':
          response = await httpClient.put<T>(url, data, requestConfig);
          break;
        case 'DELETE':
          response = await httpClient.delete<T>(url, requestConfig);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      // Call success callback if provided
      if (callbacks?.successCallback) {
        callbacks.successCallback(response.data);
      }

      return response.data;
    } catch (error) {
      // Call failure callback if provided
      if (callbacks?.failureCallback) {
        callbacks.failureCallback(error);
      }
      throw error;
    } finally {
      // Call final callback if provided
      if (callbacks?.finalCallback) {
        callbacks.finalCallback();
      }
    }
  }
};

export default http;
