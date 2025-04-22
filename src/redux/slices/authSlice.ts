
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_CONFIG } from '../../config/environment';

// Define the auth response interface
export interface AuthResponse {
  id: string;
  access_token: string;
  token_type: string;
  username: string;
  role: string;
  tenant_id: string;
  tenant_label: string;
  tenant_slug: string;
}

// Define the auth state interface
interface AuthState {
  isAuthenticated: boolean;
  user: AuthResponse | null;
  isLoading: boolean;
  error: string | null;
}

// Define the storage keys
const STORAGE_KEYS = {
  USER_ID: 'aroma_user_id',
  ACCESS_TOKEN: 'aroma_access_token',
  USERNAME: 'aroma_username',
  ROLE: 'aroma_role',
  TENANT_ID: 'aroma_tenant_id',
  TENANT_LABEL: 'aroma_tenant_label',
  TENANT_SLUG: 'aroma_tenant_slug',
};

// Helper function to load user from localStorage
const loadUserFromStorage = (): AuthResponse | null => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  if (!token) return null;

  return {
    id: localStorage.getItem(STORAGE_KEYS.USER_ID) || '',
    access_token: token,
    token_type: 'bearer',
    username: localStorage.getItem(STORAGE_KEYS.USERNAME) || '',
    role: localStorage.getItem(STORAGE_KEYS.ROLE) || '',
    tenant_id: localStorage.getItem(STORAGE_KEYS.TENANT_ID) || '',
    tenant_label: localStorage.getItem(STORAGE_KEYS.TENANT_LABEL) || '',
    tenant_slug: localStorage.getItem(STORAGE_KEYS.TENANT_SLUG) || '',
  };
};

// Helper function to save user to localStorage
const saveUserToStorage = (user: AuthResponse): void => {
  localStorage.setItem(STORAGE_KEYS.USER_ID, user.id);
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, user.access_token);
  localStorage.setItem(STORAGE_KEYS.USERNAME, user.username);
  localStorage.setItem(STORAGE_KEYS.ROLE, user.role);
  localStorage.setItem(STORAGE_KEYS.TENANT_ID, user.tenant_id);
  localStorage.setItem(STORAGE_KEYS.TENANT_LABEL, user.tenant_label);
  localStorage.setItem(STORAGE_KEYS.TENANT_SLUG, user.tenant_slug);

  // Also store in the API_CONFIG.AUTH_TOKEN_KEY for compatibility with existing code
  localStorage.setItem(API_CONFIG.AUTH_TOKEN_KEY, user.access_token);

  // Store tenant details for compatibility with existing code
  const tenantDetails = {
    id: user.tenant_id,
    name: user.tenant_label,
    slug: user.tenant_slug
  };
  localStorage.setItem(API_CONFIG.TENANT_DETAILS_KEY, JSON.stringify(tenantDetails));
  localStorage.setItem(API_CONFIG.TENANT_SLUG_KEY, user.tenant_slug);
};

// Helper function to clear user from localStorage
const clearUserFromStorage = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USERNAME);
  localStorage.removeItem(STORAGE_KEYS.ROLE);
  localStorage.removeItem(STORAGE_KEYS.TENANT_ID);
  localStorage.removeItem(STORAGE_KEYS.TENANT_LABEL);
  localStorage.removeItem(STORAGE_KEYS.TENANT_SLUG);

  // Also clear from API_CONFIG keys for compatibility
  localStorage.removeItem(API_CONFIG.AUTH_TOKEN_KEY);
  localStorage.removeItem(API_CONFIG.TENANT_DETAILS_KEY);
  localStorage.removeItem(API_CONFIG.TENANT_SLUG_KEY);
};

// Initialize state from localStorage
const initialState: AuthState = {
  isAuthenticated: Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)),
  user: loadUserFromStorage(),
  isLoading: false,
  error: null,
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;

      // Save user data to localStorage
      saveUserToStorage(action.payload);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;

      // Clear user data from localStorage
      clearUserFromStorage();
    },
  },
});

// Export actions and reducer
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;

// Export selectors
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
