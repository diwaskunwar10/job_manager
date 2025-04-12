
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../config/environment';

// Create axios instance using the environment configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Types for dispatch callback functions
export interface ApiCallbacks {
  finalCallback?: () => void;
  successCallback?: (response: any) => void;
  failureCallback?: (error: any) => void;
}

export interface ApiRequestParams {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
  data?: any;
  config?: AxiosRequestConfig;
  callbacks?: ApiCallbacks;
}

// Request interceptor
axiosInstance.interceptors.request.use(
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
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle auth errors
    if (error.response?.status === 401 || error.response?.status === 403) {
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

// API request function that follows the dispatch pattern
export const apiRequest = async ({
  url,
  method,
  params,
  data,
  config = {},
  callbacks
}: ApiRequestParams): Promise<any> => {
  try {
    let response;
    const requestConfig = { 
      ...config, 
      params: { ...params } 
    };

    switch (method) {
      case 'GET':
        response = await axiosInstance.get(url, requestConfig);
        break;
      case 'POST':
        response = await axiosInstance.post(url, data, requestConfig);
        break;
      case 'PUT':
        response = await axiosInstance.put(url, data, requestConfig);
        break;
      case 'DELETE':
        response = await axiosInstance.delete(url, requestConfig);
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
};

export default apiRequest;
