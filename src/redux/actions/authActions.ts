import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from '../slices/authSlice';
import { loginApi, prepareLoginFormData } from '../../services/authService';
import { LoginRequest } from '../../services/authService';
import { AppDispatch } from '../store';

/**
 * Login action creator
 * @param {LoginRequest} credentials - User credentials
 * @param {Function} onSuccess - Optional callback on success
 * @param {Function} onError - Optional callback on error
 * @returns {Function} - Thunk function
 */
export const login = (
  credentials: LoginRequest,
  onSuccess?: () => void,
  onError?: (error: string) => void
) => (dispatch: AppDispatch) => {
  dispatch(loginStart());

  // Prepare form data for login
  const formData = prepareLoginFormData(credentials);

  // Use the loginApi action creator directly
  dispatch(loginApi({
    data: formData,
    config: {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    successCallback: (response) => {
      dispatch(loginSuccess(response));
      if (onSuccess) onSuccess();
    },
    failureCallback: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch(loginFailure(errorMessage));
      if (onError) onError(errorMessage);
    }
  }) as any); // Type assertion to fix the TypeScript error
};

/**
 * Logout action creator
 * @param {Function} onSuccess - Optional callback on success
 * @returns {Function} - Thunk function
 */
export const logout = (onSuccess?: () => void) => (dispatch: AppDispatch) => {
  dispatch(logoutAction());
  if (onSuccess) onSuccess();
};

/**
 * Check authentication status and update Redux store accordingly
 * @returns {Function} - Thunk function
 */
export const checkAuthStatus = () => (dispatch: AppDispatch) => {
  const token = localStorage.getItem('aroma_access_token');

  if (!token) {
    dispatch(logoutAction());
    return;
  }

  // If token exists, try to reconstruct the user object from localStorage
  const user = {
    id: localStorage.getItem('aroma_user_id') || '',
    access_token: token,
    token_type: 'bearer',
    username: localStorage.getItem('aroma_username') || '',
    role: localStorage.getItem('aroma_role') || '',
    tenant_id: localStorage.getItem('aroma_tenant_id') || '',
    tenant_label: localStorage.getItem('aroma_tenant_label') || '',
    tenant_slug: localStorage.getItem('aroma_tenant_slug') || '',
  };

  dispatch(loginSuccess(user));
};
