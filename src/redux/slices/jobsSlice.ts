import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JOBS, PROJECTS } from '../../constants/apiEndpoints';
import { Job, JobOutput } from '../../types/job';
import {
  createGetApiAction,
  createPostApiAction,
  createDeleteApiAction
} from '../apiActionCreator';

export interface JobsFilter {
  jobStatus?: 'pending' | 'failed' | 'completed' | 'in-progress';
  verified?: boolean;
  searchQuery?: string;
  page: number;
  pageSize: number;
  created_at_start?: string;
  created_at_end?: string;
  sort_direction?: 'asc' | 'desc';
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

// API action creators
export const getJobsApi = createGetApiAction<any>(
  'jobs/getJobs',
  JOBS.GET_JOBS
);

export const getJobByIdApi = createGetApiAction<Job, string>(
  'jobs/getJobById',
  (jobId) => JOBS.GET_JOB_BY_ID(jobId)
);

export const getJobOutputApi = createGetApiAction<JobOutput, string>(
  'jobs/getJobOutput',
  (jobId) => JOBS.JOB_OUTPUT(jobId)
);

export const getJobsByProjectApi = createGetApiAction<any, string>(
  'jobs/getJobsByProject',
  (projectId) => PROJECTS.PROJECT_JOBS(projectId)
);

export const createJobApi = createPostApiAction<Job, string>(
  'jobs/createJob',
  (projectId) => JOBS.CREATE_JOB(projectId)
);

export const executeJobApi = createPostApiAction<any, string>(
  'jobs/executeJob',
  (jobId) => JOBS.EXECUTE_JOB(jobId)
);

export const reExecuteJobApi = createPostApiAction<any, string>(
  'jobs/reExecuteJob',
  (jobId) => JOBS.RE_EXECUTE_JOB(jobId)
);

export const assignAgentToJobApi = createPostApiAction<any, {jobId: string, agentId: string}>(
  'jobs/assignAgentToJob',
  ({jobId}) => JOBS.ASSIGN_AGENT(jobId)
);

export const removeAgentFromJobApi = createDeleteApiAction<any, {jobId: string, agentId: string}>(
  'jobs/removeAgentFromJob',
  ({jobId, agentId}) => JOBS.UNASSIGN_AGENT(jobId, agentId)
);

export const addMediaFromUriApi = createPostApiAction<any, {jobId: string, mediaUris: string[]}>(
  'jobs/addMediaFromUri',
  ({jobId}) => JOBS.ADD_MEDIA_FROM_URI(jobId)
);

// Thunk action creators that use the API action creators
export const fetchJobs = () => (dispatch: any, getState: any) => {
  const { jobs } = getState();
  const { filter } = jobs;

  // Separate filter from callbacks to fix type issues
  const { page, pageSize, ...filterParams } = filter;

  dispatch(getJobsApi({
    params: {
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filterParams
    },
    successCallback: (response) => {
      // No additional actions needed as the slice handles the state updates
    },
    failureCallback: (error) => {
      console.error('Error fetching jobs:', error);
    }
  }));
};

export const fetchJobDetail = (jobId: string) => (dispatch: any) => {
  dispatch(getJobByIdApi({
    additionalParams: jobId,
    successCallback: (response) => {
      // No additional actions needed as the slice handles the state updates
    },
    failureCallback: (error) => {
      console.error('Error fetching job details:', error);
    }
  }));
};

export const fetchJobOutput = (jobId: string) => (dispatch: any) => {
  dispatch(getJobOutputApi({
    additionalParams: jobId,
    successCallback: (response) => {
      // No additional actions needed as the slice handles the state updates
    },
    failureCallback: (error) => {
      console.error('Error fetching job output:', error);
    }
  }));
};

export const fetchJobsByProject = (projectId: string) => (dispatch: any, getState: any) => {
  const { jobs } = getState();
  const { filter } = jobs;

  dispatch(getJobsByProjectApi({
    additionalParams: projectId,
    params: {
      page: filter.page.toString(),
      pageSize: filter.pageSize.toString(),
      jobStatus: filter.jobStatus,
      verified: filter.verified,
      searchQuery: filter.searchQuery
    },
    successCallback: (response) => {
      // No additional actions needed as the slice handles the state updates
    },
    failureCallback: (error) => {
      console.error('Error fetching jobs by project:', error);
    }
  }));
};

export const addMediaToJob = (jobId: string, mediaUris: string[]) => (dispatch: any) => {
  dispatch(addMediaFromUriApi({
    additionalParams: { jobId, mediaUris },
    data: { media_uris: mediaUris },
    successCallback: (response) => {
      console.log('Media added successfully:', response);
    },
    failureCallback: (error) => {
      console.error('Error adding media to job:', error);
    }
  }));
};

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
      // Get jobs
      .addCase(getJobsApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getJobsApi.fulfilled, (state, action) => {
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
      .addCase(getJobsApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get job by ID
      .addCase(getJobByIdApi.pending, (state) => {
        state.isJobDetailLoading = true;
        state.error = null;
      })
      .addCase(getJobByIdApi.fulfilled, (state, action) => {
        state.isJobDetailLoading = false;
        state.selectedJob = action.payload;
      })
      .addCase(getJobByIdApi.rejected, (state, action) => {
        state.isJobDetailLoading = false;
        state.error = action.payload as string;
      })

      // Get job output
      .addCase(getJobOutputApi.pending, (state) => {
        state.isOutputLoading = true;
        state.error = null;
      })
      .addCase(getJobOutputApi.fulfilled, (state, action) => {
        state.isOutputLoading = false;
        state.jobOutput = action.payload;
      })
      .addCase(getJobOutputApi.rejected, (state, action) => {
        state.isOutputLoading = false;
        state.error = action.payload as string;
      })

      // Get jobs by project
      .addCase(getJobsByProjectApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getJobsByProjectApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.data || [];
        const apiMeta = action.payload.meta || {};
        state.meta = {
          total: apiMeta.total || 0,
          page: apiMeta.page || 1,
          pageSize: apiMeta.page_size || 10,
          totalPages: apiMeta.total_pages || 1,
          projectId: action.meta.arg.additionalParams,
        };
      })
      .addCase(getJobsByProjectApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.jobs = [];
      })

      // Create job
      .addCase(createJobApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createJobApi.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createJobApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Execute job
      .addCase(executeJobApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(executeJobApi.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(executeJobApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Re-execute job
      .addCase(reExecuteJobApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(reExecuteJobApi.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(reExecuteJobApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Add media from URI
      .addCase(addMediaFromUriApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMediaFromUriApi.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addMediaFromUriApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilter, clearSelectedJob, clearJobOutput } = jobsSlice.actions;
export default jobsSlice.reducer;
