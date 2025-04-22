import { httpBase } from '../utils/httpBase';
import { PROJECTS, JOBS } from '../constants/apiEndpoints';
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
    dispatch?: Dispatch<Action>
  ) => {
    return httpBase.get(
      PROJECTS.GET_PROJECTS,
      {
        params: {
          page,
          limit: pageSize
        }
      },
      dispatch
    );
  },

  // Get project details by ID
  getProjectById: (
    projectId: string,
    dispatch?: Dispatch<Action>
  ) => {
    return httpBase.get(
      PROJECTS.PROJECT_BY_ID(projectId),
      undefined,
      dispatch
    );
  },

  // Create a new project
  createProject: (
    projectData: { name: string; description: string },
    dispatch?: Dispatch<Action>
  ) => {
    return httpBase.post(
      PROJECTS.CREATE_PROJECT,
      projectData,
      undefined,
      dispatch
    );
  },

  // Update a project
  updateProject: (
    projectId: string,
    projectData: { name?: string; description?: string },
    dispatch?: Dispatch<Action>
  ) => {
    return httpBase.put(
      PROJECTS.UPDATE_PROJECT(projectId),
      projectData,
      undefined,
      dispatch
    );
  },

  // Delete a project
  deleteProject: (
    projectId: string,
    dispatch?: Dispatch<Action>
  ) => {
    return httpBase.delete(
      PROJECTS.DELETE_PROJECT(projectId),
      undefined,
      dispatch
    );
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
      createdAtStart?: string;
      createdAtEnd?: string;
    },
    dispatch?: Dispatch<Action>
  ) => {
    const {
      jobStatus,
      verified,
      searchQuery,
      page = 1,
      pageSize = 10,
      createdAtStart,
      createdAtEnd
    } = options || {};

    return httpBase.get(
      PROJECTS.PROJECT_JOBS(projectId),
      {
        params: {
          page,
          limit: pageSize,
          ...(jobStatus && { status: jobStatus }),
          ...(verified !== undefined && { verified }),
          ...(searchQuery && { search: searchQuery }),
          ...(createdAtStart && { created_at_start: createdAtStart }),
          ...(createdAtEnd && { created_at_end: createdAtEnd })
        }
      },
      dispatch
    );
  },

  // Create a job for a project
  createJob: (
    projectId: string,
    jobData: { name: string; description: string; process_name: string },
    dispatch?: Dispatch<Action>
  ) => {
    return httpBase.post(
      JOBS.CREATE_JOB(projectId),
      jobData,
      undefined,
      dispatch
    );
  },

  // Execute a job
  executeJob: (
    jobId: string,
    dispatch?: Dispatch<Action>
  ) => {
    return httpBase.post(
      JOBS.EXECUTE_JOB(jobId),
      undefined,
      undefined,
      dispatch
    );
  },

  // Re-execute a job
  reExecuteJob: (
    jobId: string,
    dispatch?: Dispatch<Action>
  ) => {
    return httpBase.post(
      JOBS.RE_EXECUTE_JOB(jobId),
      undefined,
      undefined,
      dispatch
    );
  },

  // Get job output
  getJobOutput: (
    jobId: string,
    includePresignedUrls: boolean = false,
    expiry: number = 3600,
    dispatch?: Dispatch<Action>
  ) => {
    return httpBase.get(
      JOBS.JOB_OUTPUT(jobId),
      {
        params: {
          include_presigned_urls: includePresignedUrls,
          expiry
        }
      },
      dispatch
    );
  }
};
