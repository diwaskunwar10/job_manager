
// Environment configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',

  // Updated auth token key
  AUTH_TOKEN_KEY: 'aroma_auth_token',

  TENANT_DETAILS_KEY: 'tenantDetails',
  TENANT_SLUG_KEY: 'tenantSlug'
};
