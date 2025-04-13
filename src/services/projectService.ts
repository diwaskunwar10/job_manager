import apiRequest, { ApiCallbacks } from '../utils/httpClient';
import { PROJECTS, JOBS } from '../constants/apiEndpoints';

export interface Project {
  _id: string;
  name: string;
  description: string;
}

export interface ProjectsResponse {
  data: Project[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ProjectDetail {
  _id: string;
  name: string;
  description: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  assignedTo?: string;
  progress?: number;
}

export interface Job {
  _id: string;
  id: string;
  name: string;
  description?: string;
  status: string;
  type?: string | undefined;
  project_id: string;
  project_name?: string;
  created_at: string;
  executed_at?: string;
  completed_at?: string;
}

export interface JobsResponse {
  data: Job[];
  meta: {
    total: number;
    page: number;
    page_size: number;
  };
}

// Project Services
export const projectService = {
  // Get projects with pagination
  getProjects: (
    page: number = 1,
    pageSize: number = 10,
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: PROJECTS.GET_PROJECTS,
      method: 'GET',
      params: {
        page,
        page_size: pageSize
      },
      callbacks
    });
  },

  // Get project details by ID (DEPRECATED)
  getProjectById: (
    projectId: string,
    callbacks?: ApiCallbacks
  ) => {
    console.warn('getProjectById is deprecated. Use project from list instead.');
    return apiRequest({
      url: PROJECTS.PROJECT_BY_ID(projectId),
      method: 'GET',
      callbacks
    });
  },

  // Get jobs by project ID with filtering and pagination
  getJobsByProject: (
    projectId: string,
    options?: {
      jobStatus?: 'pending' | 'failed' | 'completed' | 'in-progress';
      verified?: boolean;
      searchQuery?: string;
      page?: number;
      pageSize?: number;
    },
    callbacks?: ApiCallbacks
  ) => {
    const {
      jobStatus,
      verified,
      searchQuery,
      page = 1,
      pageSize = 10
    } = options || {};

    return apiRequest({
      url: JOBS.JOBS_BY_PROJECT(projectId),
      method: 'GET',
      params: {
        page,
        page_size: pageSize,
        ...(jobStatus && { job_status: jobStatus }),
        ...(verified !== undefined && { verified }),
        ...(searchQuery && { search_query: searchQuery })
      },
      callbacks
    });
  },

  // Execute a job
  executeJob: (
    jobId: string,
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: JOBS.EXECUTE_JOB(jobId),
      method: 'POST',
      callbacks
    });
  },

  // Re-execute a job
  reExecuteJob: (
    jobId: string,
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: JOBS.RE_EXECUTE_JOB(jobId),
      method: 'POST',
      callbacks
    });
  },

  // Get job output
  getJobOutput: (
    jobId: string,
    jobIndex: number = 0,
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: JOBS.JOB_OUTPUT(jobId),
      method: 'GET',
      params: {
        job_index: jobIndex
      },
      callbacks
    });
  }
};
