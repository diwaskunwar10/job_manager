
// Environment configuration
export const API_CONFIG = {
  // Use the API URL directly from environment variables
  // Ensure it includes the /v1 prefix
  BASE_URL: import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/v1` : 'https://aroma-api.nextai.asia/v1',

  // Updated auth token key
  AUTH_TOKEN_KEY: 'aroma_auth_token',

  TENANT_DETAILS_KEY: 'tenantDetails',
  TENANT_SLUG_KEY: 'tenantSlug'
};
