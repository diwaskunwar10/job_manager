import { createAsyncThunk } from '@reduxjs/toolkit';
import { http, ApiCallbacks } from '../utils/http';

export interface ApiRequestConfig<P = any> {
  // API request parameters
  params?: Record<string, any>;
  data?: any;
  config?: any; // For custom axios config

  // Callbacks
  finalCallback?: () => void;
  successCallback?: (response: any) => void;
  failureCallback?: (error: any) => void;

  // Additional parameters for the thunk
  additionalParams?: P;
}

/**
 * Creates an API action creator with standardized callbacks
 *
 * @param typePrefix The Redux action type prefix
 * @param apiCall Function that makes the API call
 * @returns An async thunk action creator
 */
export function createApiAction<Returned, ThunkArg = ApiRequestConfig, P = any>(
  typePrefix: string,
  apiCall: (arg: ThunkArg, additionalParams?: P) => Promise<Returned>
) {
  return createAsyncThunk<Returned, ThunkArg>(
    typePrefix,
    async (arg, { rejectWithValue }) => {
      try {
        // Extract callbacks from the argument
        const { finalCallback, successCallback, failureCallback, ...rest } = arg as ApiRequestConfig<P>;

        // Create callbacks object for the API call
        const callbacks: ApiCallbacks = {
          finalCallback,
          successCallback,
          failureCallback
        };

        // Make the API call
        const response = await apiCall(rest as ThunkArg, (rest as ApiRequestConfig<P>).additionalParams);

        // Call success callback if provided
        if (successCallback) {
          successCallback(response);
        }

        // Call final callback if provided
        if (finalCallback) {
          finalCallback();
        }

        return response;
      } catch (error) {
        // Extract callbacks from the argument
        const { failureCallback, finalCallback } = arg as ApiRequestConfig<P>;

        // Call failure callback if provided
        if (failureCallback) {
          failureCallback(error);
        }

        // Call final callback if provided
        if (finalCallback) {
          finalCallback();
        }

        // Handle error for Redux
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );
}

/**
 * Creates a GET API action creator
 *
 * @param typePrefix The Redux action type prefix
 * @param endpoint The API endpoint
 * @returns An async thunk action creator
 */
export function createGetApiAction<Returned, P = any>(
  typePrefix: string,
  endpoint: string | ((params: any) => string)
) {
  return createApiAction<Returned, ApiRequestConfig<P>>(
    typePrefix,
    async (arg, additionalParams) => {
      const { params } = arg;
      const url = typeof endpoint === 'function' ? endpoint(additionalParams) : endpoint;

      return http.get(url, { params });
    }
  );
}

/**
 * Creates a POST API action creator
 *
 * @param typePrefix The Redux action type prefix
 * @param endpoint The API endpoint
 * @returns An async thunk action creator
 */
export function createPostApiAction<Returned, P = any>(
  typePrefix: string,
  endpoint: string | ((params: any) => string)
) {
  return createApiAction<Returned, ApiRequestConfig<P>>(
    typePrefix,
    async (arg, additionalParams) => {
      const { params, data, config } = arg;
      const url = typeof endpoint === 'function' ? endpoint(additionalParams) : endpoint;

      // Merge params into config if provided
      const axiosConfig = config || {};
      if (params) {
        axiosConfig.params = params;
      }

      return http.post(url, data, axiosConfig);
    }
  );
}

/**
 * Creates a PUT API action creator
 *
 * @param typePrefix The Redux action type prefix
 * @param endpoint The API endpoint
 * @returns An async thunk action creator
 */
export function createPutApiAction<Returned, P = any>(
  typePrefix: string,
  endpoint: string | ((params: any) => string)
) {
  return createApiAction<Returned, ApiRequestConfig<P>>(
    typePrefix,
    async (arg, additionalParams) => {
      const { params, data } = arg;
      const url = typeof endpoint === 'function' ? endpoint(additionalParams) : endpoint;

      return http.put(url, data, { params });
    }
  );
}

/**
 * Creates a DELETE API action creator
 *
 * @param typePrefix The Redux action type prefix
 * @param endpoint The API endpoint
 * @returns An async thunk action creator
 */
export function createDeleteApiAction<Returned, P = any>(
  typePrefix: string,
  endpoint: string | ((params: any) => string)
) {
  return createApiAction<Returned, ApiRequestConfig<P>>(
    typePrefix,
    async (arg, additionalParams) => {
      const { params } = arg;
      const url = typeof endpoint === 'function' ? endpoint(additionalParams) : endpoint;

      return http.delete(url, { params });
    }
  );
}
