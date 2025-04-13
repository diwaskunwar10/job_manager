
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '../../services/projectService';
import JobService from '../../services/jobService';
import { Job } from '../../types/job';

export interface JobsFilter {
  jobStatus?: 'pending' | 'failed' | 'completed' | 'in-progress';
  verified?: boolean;
  searchQuery?: string;
  page: number;
  pageSize: number;
}

interface JobOutput {
  jobId: string;
  output: string;
  timestamp: string;
}

interface JobsState {
  jobs: Job[];
  selectedJob: Job | null;
  jobOutput: JobOutput | null;
  isLoading: boolean;
  isJobDetailLoading: boolean;
  isOutputLoading: boolean;
  error: string | null;
  filter: JobsFilter;
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    projectId?: string;
  };
}

const initialState: JobsState = {
  jobs: [],
  selectedJob: null,
  jobOutput: null,
  isLoading: false,
  isJobDetailLoading: false,
  isOutputLoading: false,
  error: null,
  filter: {
    page: 1,
    pageSize: 10,
  },
  meta: {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  },
};

// Async thunks for jobs
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { jobs: JobsState };
      const { filter } = state.jobs;
      const response = await JobService.getJobs(filter.page, filter.pageSize, filter);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchJobsByProject = createAsyncThunk(
  'jobs/fetchJobsByProject',
  async (projectId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { jobs: JobsState };
      const { filter } = state.jobs;
      const options = {
        jobStatus: filter.jobStatus,
        verified: filter.verified,
        searchQuery: filter.searchQuery,
        page: filter.page,
        pageSize: filter.pageSize,
      };
      const response = await projectService.getJobsByProject(projectId, options);
      return { ...response, projectId };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchJobDetail = createAsyncThunk(
  'jobs/fetchJobDetail',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await JobService.getJobById(jobId);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchJobOutput = createAsyncThunk(
  'jobs/fetchJobOutput',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await projectService.getJobOutput(jobId);
      return {
        jobId,
        output: response.output || 'No output available',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<JobsFilter>>) => {
      // If filter changes other than page, reset to page 1
      if ('jobStatus' in action.payload || 'verified' in action.payload || 
          'searchQuery' in action.payload || 'pageSize' in action.payload) {
        state.filter = {
          ...state.filter,
          ...action.payload,
          page: 1,
        };
      } else {
        state.filter = {
          ...state.filter,
          ...action.payload,
        };
      }
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
    clearJobOutput: (state) => {
      state.jobOutput = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.data || [];
        const apiMeta = action.payload.meta || {};
        state.meta = {
          total: apiMeta.total || 0,
          page: apiMeta.page || 1,
          pageSize: apiMeta.page_size || 10,
          totalPages: apiMeta.total_pages || 1,
        };
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch jobs by project
      .addCase(fetchJobsByProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobsByProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.data || [];
        const apiMeta = action.payload.meta || {};
        state.meta = {
          total: apiMeta.total || 0,
          page: apiMeta.page || 1,
          pageSize: apiMeta.page_size || 10,
          totalPages: apiMeta.total_pages || 1,
          projectId: action.payload.projectId,
        };
      })
      .addCase(fetchJobsByProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.jobs = [];
      })
      
      // Fetch job detail
      .addCase(fetchJobDetail.pending, (state) => {
        state.isJobDetailLoading = true;
        state.error = null;
      })
      .addCase(fetchJobDetail.fulfilled, (state, action) => {
        state.isJobDetailLoading = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobDetail.rejected, (state, action) => {
        state.isJobDetailLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch job output
      .addCase(fetchJobOutput.pending, (state) => {
        state.isOutputLoading = true;
        state.error = null;
      })
      .addCase(fetchJobOutput.fulfilled, (state, action) => {
        state.isOutputLoading = false;
        state.jobOutput = action.payload;
      })
      .addCase(fetchJobOutput.rejected, (state, action) => {
        state.isOutputLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilter, clearSelectedJob, clearJobOutput } = jobsSlice.actions;
export default jobsSlice.reducer;
