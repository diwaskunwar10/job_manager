
import apiRequest, { ApiCallbacks } from '../utils/httpClient';
import { JOBS, AGENTS } from '../constants/apiEndpoints';
import { Agent } from '../types/agent';
import { Job } from '../types/job';

/**
 * Service for job-related API calls
 */
const JobService = {
  /**
   * Get jobs with pagination
   */
  getJobs: (
    page = 1, 
    pageSize = 10, 
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: JOBS.GET_JOBS,
      method: 'GET',
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      },
      callbacks
    });
  },

  /**
   * Get job details by ID
   */
  getJobById: (
    jobId: string, 
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: JOBS.GET_JOB_BY_ID(jobId),
      method: 'GET',
      callbacks
    });
  },

  /**
   * Get all agents
   */
  getAllAgents: (
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: AGENTS.GET_ALL_AGENTS,
      method: 'GET',
      callbacks
    });
  },

  /**
   * Assign agent to job
   */
  assignAgentToJob: (
    jobId: string, 
    agentId: string, 
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: JOBS.ASSIGN_AGENT(jobId),
      method: 'POST',
      params: { agent_id: agentId },
      callbacks
    });
  },

  /**
   * Remove agent from job
   */
  removeAgentFromJob: (
    jobId: string, 
    agentId: string, 
    callbacks?: ApiCallbacks
  ) => {
    console.log(`Service: Removing agent ${agentId} from job ${jobId}`);
    if (!jobId) {
      console.error('Service: Job ID is undefined or null');
      throw new Error('Job ID is required');
    }
    return apiRequest({
      url: JOBS.UNASSIGN_AGENT(jobId, agentId),
      method: 'PUT',
      callbacks
    });
  },

  /**
   * Get agents assigned to a job
   */
  getAssignedAgents: (
    jobId: string, 
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: JOBS.GET_ASSIGNED_AGENTS(jobId),
      method: 'GET',
      callbacks
    });
  },

  /**
   * Get all jobs for a project
   */
  getJobsByProject: (
    projectId: string, 
    page = 1, 
    pageSize = 10, 
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: JOBS.JOBS_BY_PROJECT(projectId),
      method: 'GET',
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      },
      callbacks
    });
  }
};

export default JobService;
