import { http } from '../utils/http';
import { AUTH } from '../constants/apiEndpoints';
import { AuthResponse } from '../redux/slices/authSlice';
import { createPostApiAction } from '../redux/apiActionCreator';

// Define login request interface
export interface LoginRequest {
  username: string;
  password: string;
  client_id?: string;
  grant_type?: string;
  scope?: string;
}

// Create API action creator for login
export const loginApi = createPostApiAction<AuthResponse>(
  'auth/login',
  AUTH.LOGIN
);

// Helper function to prepare login form data
export const prepareLoginFormData = (credentials: LoginRequest): URLSearchParams => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);
  formData.append('client_id', credentials.client_id || 'string');
  formData.append('grant_type', credentials.grant_type || 'password');
  formData.append('scope', credentials.scope || '');
  return formData;
};

// Auth service with methods for authentication
const AuthService = {
  /**
   * Login user
   * @param {LoginRequest} credentials - User credentials
   * @returns {Promise<AuthResponse>} - Promise with auth response
   */
  login: (credentials: LoginRequest): Promise<AuthResponse> => {
    // Create URLSearchParams for form data
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('client_id', credentials.client_id || 'string');
    formData.append('grant_type', credentials.grant_type || 'password');
    formData.append('scope', credentials.scope || '');

    return http.post<AuthResponse>(
      AUTH.LOGIN,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  },

  /**
   * Logout user
   * @returns {Promise<any>} - Promise with logout response
   */
  logout: (): Promise<any> => {
    return http.post(
      AUTH.LOGOUT,
      {}
    );
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return Boolean(localStorage.getItem('aroma_access_token'));
  },

  /**
   * Get user role
   * @returns {string|null} - User role or null if not authenticated
   */
  getUserRole: (): string | null => {
    return localStorage.getItem('aroma_role');
  },

  /**
   * Get tenant ID
   * @returns {string|null} - Tenant ID or null if not authenticated
   */
  getTenantId: (): string | null => {
    return localStorage.getItem('aroma_tenant_id');
  },

  /**
   * Get tenant slug
   * @returns {string|null} - Tenant slug or null if not authenticated
   */
  getTenantSlug: (): string | null => {
    return localStorage.getItem('aroma_tenant_slug');
  }
};

export default AuthService;
