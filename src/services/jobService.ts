import { http } from '../utils/http';
import { JOBS, AGENTS, PROJECTS } from '../constants/apiEndpoints';
import { Dispatch } from 'react';
import { Action } from '../types/dispatcherTypes';
import { Job, JobOutput } from '../types/job';
import { Agent } from '../types/agent';

/**
 * Service for job-related API calls
 */
const JobService = {
  /**
   * Get jobs with pagination and filters
   * @param {number} page - Page number
   * @param {number} pageSize - Number of items per page
   * @param {Object} filters - Optional filters
   * @param {string} filters.search_query - Search query
   * @param {string} filters.project_id - Project ID
   * @param {boolean} filters.verified - Verification status
   * @param {string} filters.created_at_start - Created after date
   * @param {string} filters.created_at_end - Created before date
   * @param {string} filters.executed_at_start - Executed after date
   * @param {string} filters.executed_at_end - Executed before date
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise} - Promise with jobs data
   */
  getJobs: (
    page = 1,
    pageSize = 10,
    filters = {},
    dispatch?: Dispatch<Action>
  ) => {
    return http.get(
      JOBS.GET_JOBS,
      {
        params: {
          page: page.toString(),
          pageSize: pageSize.toString(),
          ...filters
        }
      },
      dispatch
    );
  },

  /**
   * Get job details by ID
   * @param {string} jobId - Job ID
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<Job>} - Promise with job details
   */
  getJobById: (
    jobId: string,
    dispatch?: Dispatch<Action>
  ): Promise<Job> => {
    return http.get(
      JOBS.GET_JOB_BY_ID(jobId),
      undefined,
      dispatch
    );
  },

  /**
   * Get job output by ID (Aroma Backend v2)
   * @param {string} jobId - Job ID
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<JobOutput>} - Promise with job output
   */
  getJobOutput: (
    jobId: string,
    dispatch?: Dispatch<Action>
  ): Promise<JobOutput> => {
    return http.get(
      JOBS.JOB_OUTPUT(jobId),
      undefined,
      dispatch
    );
  },

  /**
   * Get media content by ID (Aroma Backend v2)
   * @param {string} mediaId - Media ID (input_id or output_id)
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<MediaContent>} - Promise with media content
   */
  getMediaContent: (
    mediaId: string,
    dispatch?: Dispatch<Action>
  ): Promise<any> => {
    return http.get(
      JOBS.MEDIA_CONTENT(mediaId),
      undefined,
      dispatch
    );
  },

  /**
   * Get presigned URL for media object
   * @param {string} objectName - Object name
   * @param {number} expiry - Expiry time in seconds
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<{url: string}>} - Promise with presigned URL
   */
  getMediaPresignedUrl: (
    objectName: string,
    expiry = 3600,
    dispatch?: Dispatch<Action>
  ): Promise<{url: string}> => {
    return http.get(
      JOBS.MEDIA_PRESIGNED_URL,
      {
        params: {
          object_name: objectName,
          expiry: expiry.toString()
        }
      },
      dispatch
    );
  },

  /**
   * Get all agents
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<{agents: Agent[]}>} - Promise with agents data
   */
  getAllAgents: (
    dispatch?: Dispatch<Action>
  ): Promise<{agents: Agent[]} | Agent[]> => {
    return http.get(
      AGENTS.GET_ALL_AGENTS,
      undefined,
      dispatch
    );
  },

  /**
   * Assign agent to job
   * @param {string} jobId - Job ID
   * @param {string} agentId - Agent ID
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<any>} - Promise with assignment result
   */
  assignAgentToJob: (
    jobId: string,
    agentId: string,
    dispatch?: Dispatch<Action>
  ): Promise<any> => {
    return http.post(
      JOBS.ASSIGN_AGENT(jobId),
      {},
      {
        params: {
          agent_id: agentId
        }
      },
      dispatch
    );
  },

  /**
   * Remove agent from job
   * @param {string} jobId - Job ID
   * @param {string} agentId - Agent ID
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<any>} - Promise with unassignment result
   */
  removeAgentFromJob: (
    jobId: string,
    agentId: string,
    dispatch?: Dispatch<Action>
  ): Promise<any> => {
    console.log(`Service: Removing agent ${agentId} from job ${jobId}`);
    if (!jobId) {
      console.error('Service: Job ID is undefined or null');
      throw new Error('Job ID is required');
    }
    return http.delete(
      JOBS.UNASSIGN_AGENT(jobId, agentId),
      undefined,
      dispatch
    );
  },

  /**
   * Get agents assigned to a job
   * @param {string} jobId - Job ID
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<{data: Agent[]}>} - Promise with assigned agents data
   */
  getAssignedAgents: (
    jobId: string,
    dispatch?: Dispatch<Action>
  ): Promise<{data: Agent[]}> => {
    return http.get(
      JOBS.GET_ASSIGNED_AGENTS(jobId),
      undefined,
      dispatch
    );
  },

  /**
   * Get all jobs for a project
   * @param {string} projectId - Project ID
   * @param {number} page - Page number
   * @param {number} pageSize - Number of items per page
   * @param {Object} filters - Optional filters
   * @param {string[]} projection - Fields to include in the response
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<{data: Job[], meta: any}>} - Promise with jobs data
   */
  getJobsByProject: (
    projectId: string,
    page = 1,
    pageSize = 10,
    filters = {},
    projection = ["_id", "name", "description", "status", "process_name", "created_at", "created_by", "verified"],
    dispatch?: Dispatch<Action>
  ): Promise<{ data: Job[]; meta: any }> => {
    // Ensure status is always included in projection
    if (!projection.includes("status")) {
      projection.push("status");
    }

    // We need to manually construct the URL with multiple projection parameters
    let url = PROJECTS.PROJECT_JOBS(projectId) + '?';

    // Add page and limit parameters
    url += `page=${page}&limit=${pageSize}`;

    // Add other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url += `&${key}=${value}`;
      }
    });

    // Add each projection field as a separate parameter
    projection.forEach(field => {
      url += `&projection=${field}`;
    });

    return http.get(url, undefined, dispatch);
  },

  /**
   * Create a new job for a project
   * @param {string} projectId - Project ID
   * @param {Object} jobData - Job data
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<Job>} - Promise with created job data
   */
  createJob: (
    projectId: string,
    jobData: Partial<Job>,
    dispatch?: Dispatch<Action>
  ): Promise<Job> => {
    return http.post(
      JOBS.CREATE_JOB(projectId),
      jobData,
      undefined,
      dispatch
    );
  },

  /**
   * Execute a job
   * @param {string} jobId - Job ID
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<any>} - Promise with execution result
   */
  executeJob: (
    jobId: string,
    dispatch?: Dispatch<Action>
  ): Promise<any> => {
    return http.post(
      JOBS.EXECUTE_JOB(jobId),
      {},
      undefined,
      dispatch
    );
  },

  /**
   * Re-execute a job
   * @param {string} jobId - Job ID
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<any>} - Promise with re-execution result
   */
  reExecuteJob: (
    jobId: string,
    dispatch?: Dispatch<Action>
  ): Promise<any> => {
    return http.post(
      JOBS.RE_EXECUTE_JOB(jobId),
      {},
      undefined,
      dispatch
    );
  },

  /**
   * Get job status counts
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<any>} - Promise with status counts
   */
  getJobStatusCounts: (
    dispatch?: Dispatch<Action>
  ): Promise<any> => {
    return http.get(
      JOBS.JOBS_STATUS_COUNT,
      undefined,
      dispatch
    );
  },

  /**
   * Get unassigned jobs count
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<any>} - Promise with unassigned count
   */
  getUnassignedJobsCount: (
    dispatch?: Dispatch<Action>
  ): Promise<any> => {
    return http.get(
      JOBS.JOBS_UNASSIGNED_COUNT,
      undefined,
      dispatch
    );
  },

  /**
   * Add media from URI to a job
   * @param {string} jobId - Job ID
   * @param {string[]} mediaUris - Array of media URIs to add
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise<any>} - Promise with result
   */
  addMediaFromUri: (
    jobId: string,
    mediaUris: string[],
    dispatch?: Dispatch<Action>
  ): Promise<any> => {
    return http.post(
      JOBS.ADD_MEDIA_FROM_URI(jobId),
      { media_uris: mediaUris },
      undefined,
      dispatch
    );
  }
};

export default JobService;
