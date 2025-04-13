
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TenantDetails } from '../../types/dispatcherTypes';
import { API_CONFIG } from '../../config/environment';

interface TenantState {
  tenant: TenantDetails | null;
  isLoading: boolean;
  error: string | null;
}

const initialTenantJSON = localStorage.getItem(API_CONFIG.TENANT_DETAILS_KEY);
const initialTenant = initialTenantJSON ? JSON.parse(initialTenantJSON) : null;

const initialState: TenantState = {
  tenant: initialTenant,
  isLoading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenantStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setTenantSuccess: (state, action: PayloadAction<TenantDetails>) => {
      state.tenant = action.payload;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem(API_CONFIG.TENANT_DETAILS_KEY, JSON.stringify(action.payload));
    },
    setTenantFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearTenant: (state) => {
      state.tenant = null;
      localStorage.removeItem(API_CONFIG.TENANT_DETAILS_KEY);
    },
  },
});

export const { setTenantStart, setTenantSuccess, setTenantFailure, clearTenant } = tenantSlice.actions;
export default tenantSlice.reducer;
