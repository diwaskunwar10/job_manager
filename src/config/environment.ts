
// Environment configuration
export const API_CONFIG = {
  // Base URL is now handled by the Vite proxy configuration
  // The proxy will forward requests to http://127.0.0.1:8000/v1
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/v1',

  // Updated auth token key
  AUTH_TOKEN_KEY: 'aroma_auth_token',

  TENANT_DETAILS_KEY: 'tenantDetails',
  TENANT_SLUG_KEY: 'tenantSlug'
};
