import { httpBase } from '../utils/httpBase';
import { Dispatch } from 'react';
import { Action } from '../types/dispatcherTypes';

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
  // Add more fields as needed for project details
  status?: string;
  startDate?: string;
  endDate?: string;
  assignedTo?: string;
  progress?: number;
}

export interface Job {
  _id: string;
  name: string;
  type: string;
  created_by: string;
  created_at: string;
  status: string;
  verified: boolean;
  project_id: string;
  completed_at: string;
  executed_at: string;
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
  getProjects: async (
    page: number = 1,
    pageSize: number = 10,
    dispatch?: Dispatch<Action>
  ): Promise<ProjectsResponse> => {
    return httpBase.get<ProjectsResponse>(
      `/get_projects?page=${page}&page_size=${pageSize}`,
      undefined,
      dispatch
    );
  },

  // Get project details by ID (DEPRECATED - use project from list instead)
  // This method is kept for backward compatibility
  getProjectById: async (
    projectId: string,
    dispatch?: Dispatch<Action>
  ): Promise<ProjectDetail> => {
    console.warn('getProjectById is deprecated. Use project from list instead.');
    return httpBase.get<ProjectDetail>(
      `/projects/${projectId}`,
      undefined,
      dispatch
    );
  },

  // Get jobs by project ID with filtering and pagination
  getJobsByProject: async (
    projectId: string,
    options?: {
      jobStatus?: 'pending' | 'failed' | 'completed' | 'in-progress';
      verified?: boolean;
      searchQuery?: string;
      page?: number;
      pageSize?: number;
    },
    dispatch?: Dispatch<Action>
  ): Promise<JobsResponse> => {
    const {
      jobStatus,
      verified,
      searchQuery,
      page = 1,
      pageSize = 10
    } = options || {};

    // Build query parameters
    let queryParams = `page=${page}&page_size=${pageSize}`;

    if (jobStatus) {
      queryParams += `&job_status=${jobStatus}`;
    }

    if (verified !== undefined) {
      queryParams += `&verified=${verified}`;
    }

    if (searchQuery) {
      queryParams += `&search_query=${encodeURIComponent(searchQuery)}`;
    }

    return httpBase.get<JobsResponse>(
      `/jobs/${projectId}?${queryParams}`,
      undefined,
      dispatch
    );
  },

  // Execute a job
  executeJob: async (
    jobId: string,
    dispatch?: Dispatch<Action>
  ): Promise<void> => {
    return httpBase.post<void>(
      `/jobs/${jobId}/execute`,
      {},
      undefined,
      dispatch
    );
  },

  // Re-execute a job
  reExecuteJob: async (
    jobId: string,
    dispatch?: Dispatch<Action>
  ): Promise<void> => {
    return httpBase.post<void>(
      `/jobs/${jobId}/reexecute`,
      {},
      undefined,
      dispatch
    );
  }
};
