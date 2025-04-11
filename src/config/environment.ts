
// Environment configuration
export const API_CONFIG = {
  // Use environment variable with fallback to the current ngrok URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://36e2-2400-1a00-b030-7824-6a6c-791a-70da-9afe.ngrok-free.app',
  
  // Auth token key in localStorage
  AUTH_TOKEN_KEY: 'aroma_auth_token',
  
  // Tenant details key in localStorage
  TENANT_DETAILS_KEY: 'tenantDetails'
};
