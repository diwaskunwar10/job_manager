import { logout } from '../redux/actions/authActions';
import { store } from '../redux/store';

/**
 * Handle authentication errors
 * @param error - The error to handle
 * @returns boolean - True if the error was handled, false otherwise
 */
export const handleAuthError = (error: any): boolean => {
  // Check if the error is an auth error
  const isAuthError =
    (error && (error as any).isAuthError) ||
    (error && error.message && error.message.includes('401: Unauthorized')) ||
    (error && error.response && (error.response.status === 401 || error.response.status === 403));

  if (isAuthError) {
    // Get tenant slug
    let tenantSlug = (error as any).tenantSlug || localStorage.getItem('aroma_tenant_slug') || '';

    // Dispatch logout action
    store.dispatch(logout());

    // Redirect to logout page
    if (tenantSlug) {
      window.location.href = `/${tenantSlug}/logout`;
    } else {
      window.location.href = '/404';
    }

    return true;
  }

  return false;
};

/**
 * Create a global error handler for auth errors
 */
export const setupGlobalAuthErrorHandler = () => {
  // Add a global error handler
  window.addEventListener('unhandledrejection', (event) => {
    // Try to handle auth errors
    if (handleAuthError(event.reason)) {
      // Prevent the default handler
      event.preventDefault();
    }
  });
};

export default handleAuthError;
