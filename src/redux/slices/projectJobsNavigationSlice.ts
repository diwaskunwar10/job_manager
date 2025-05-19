import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectJobsNavigationState {
  activeTab: string;
  projectId: string | null;
  page: number;
  pageSize: number;
  jobStatus?: 'pending' | 'failed' | 'completed' | 'in-progress';
  searchQuery?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  selectedJobId?: string | null;
}

const initialState: ProjectJobsNavigationState = {
  activeTab: 'details',
  projectId: null,
  page: 1,
  pageSize: 10,
};

const projectJobsNavigationSlice = createSlice({
  name: 'projectJobsNavigation',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setProjectId: (state, action: PayloadAction<string | null>) => {
      state.projectId = action.payload;
    },
    setJobsPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setJobsPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setSelectedJobId: (state, action: PayloadAction<string | null>) => {
      state.selectedJobId = action.payload;
    },
    setJobsFilter: (state, action: PayloadAction<{
      jobStatus?: 'pending' | 'failed' | 'completed' | 'in-progress';
      searchQuery?: string;
      createdAtStart?: string;
      createdAtEnd?: string;
    }>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveNavigationState: (state, action: PayloadAction<{
      activeTab: string;
      projectId: string;
      page: number;
      pageSize: number;
      jobStatus?: 'pending' | 'failed' | 'completed' | 'in-progress';
      searchQuery?: string;
      createdAtStart?: string;
      createdAtEnd?: string;
      selectedJobId?: string | null;
    }>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const {
  setActiveTab,
  setProjectId,
  setJobsPage,
  setJobsPageSize,
  setSelectedJobId,
  setJobsFilter,
  saveNavigationState,
} = projectJobsNavigationSlice.actions;

export default projectJobsNavigationSlice.reducer;
