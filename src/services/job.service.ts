import { httpBase } from '../utils/httpBase';
import { Dispatch } from 'react';
import { Action } from '../types/dispatcherTypes';

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
  getJobs: (page = 1, pageSize = 10, filters = {}, dispatch?: Dispatch<Action>) => {
    return httpBase.get('/get_jobs', {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...filters
      }
    }, dispatch);
  },

  /**
   * Get job details by ID
   * @param {string} jobId - Job ID
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise} - Promise with job details
   */
  getJobById: (jobId: string, dispatch?: Dispatch<Action>) => {
    return httpBase.get(`/jobs/${jobId}`, undefined, dispatch);
  },

  /**
   * Get all agents
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise} - Promise with agents data
   */
  getAllAgents: (dispatch?: Dispatch<Action>) => {
    return httpBase.get('/agents/all', undefined, dispatch);
  },

  /**
   * Assign agent to job
   * @param {string} jobId - Job ID
   * @param {string} agentId - Agent ID
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise} - Promise with assignment result
   */
  assignAgentToJob: (jobId: string, agentId: string, dispatch?: Dispatch<Action>) => {
    // Send agent_id as a query parameter
    return httpBase.post(`/jobs/${jobId}/assign?agent_id=${agentId}`, {}, undefined, dispatch);
  },

  /**
   * Remove agent from job
   * @param {string} jobId - Job ID
   * @param {string} agentId - Agent ID
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise} - Promise with removal result
   */
  removeAgentFromJob: (jobId: string, agentId: string, dispatch?: Dispatch<Action>) => {
    console.log(`Service: Removing agent ${agentId} from job ${jobId}`);
    if (!jobId) {
      console.error('Service: Job ID is undefined or null');
      throw new Error('Job ID is required');
    }
    return httpBase.put(`/unassign_job/${jobId}/${agentId}`, undefined, undefined, dispatch);
  },

  /**
   * Get agents assigned to a job
   * @param {string} jobId - Job ID
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise} - Promise with assigned agents data
   */
  getAssignedAgents: (jobId: string, dispatch?: Dispatch<Action>) => {
    return httpBase.get(`/jobs/${jobId}/agents`, undefined, dispatch);
  },

  /**
   * Get all jobs for a project
   * @param {string} projectId - Project ID
   * @param {number} page - Page number
   * @param {number} pageSize - Number of items per page
   * @param {Dispatch<Action>} dispatch - Optional dispatch function for state updates
   * @returns {Promise} - Promise with jobs data
   */
  getJobsByProject: (projectId: string, page = 1, pageSize = 10, dispatch?: Dispatch<Action>) => {
    return httpBase.get(`/jobs/${projectId}`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }, dispatch);
  }
};

export default JobService;
