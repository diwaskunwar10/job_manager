
import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './slices/projectsSlice';
import jobsReducer from './slices/jobsSlice';
import agentsReducer from './slices/agentsSlice';
import tenantReducer from './slices/tenantSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    jobs: jobsReducer,
    agents: agentsReducer,
    tenant: tenantReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
