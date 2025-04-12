
import apiRequest, { ApiCallbacks } from '../utils/httpClient';
import { USERS, AGENTS, SUPERVISORS, JOBS } from '../constants/apiEndpoints';

export interface UserRoleCount {
  role: string;
  count: number;
}

export interface AgentPerformance {
  agent_id: string;
  agent_name: string;
  calls_handled: number;
  average_handling_time: number;
  satisfaction_score: number;
}

export interface SupervisorAssignment {
  supervisor_name: string;
  team_size: number;
  active_projects: number;
  completion_rate: number;
}

export interface JobsVerifiedCount {
  count: number;
}

export interface JobsStatusCount {
  completed: number;
  inProgress: number;
  pending: number;
}

export interface JobsUnassignedCount {
  count: number;
}

// Dashboard Services
export const dashboardService = {
  getUserRolesCount: (
    startDate: string,
    endDate: string,
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: USERS.ROLES_COUNT,
      method: 'GET',
      params: {
        start_date: startDate,
        end_date: endDate
      },
      callbacks
    });
  },

  getAgentPerformance: (
    startDate: string,
    endDate: string,
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: AGENTS.PERFORMANCE,
      method: 'GET',
      params: {
        start_date: startDate,
        end_date: endDate
      },
      callbacks
    });
  },

  getSupervisorAssignments: (
    startDate: string,
    endDate: string,
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: SUPERVISORS.ASSIGNMENTS,
      method: 'GET',
      params: {
        start_date: startDate,
        end_date: endDate
      },
      callbacks
    });
  },

  getJobsVerifiedCounts: (
    startDate: string,
    endDate: string,
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: JOBS.JOBS_VERIFIED_COUNT,
      method: 'GET',
      params: {
        start_date: startDate,
        end_date: endDate
      },
      callbacks
    });
  },

  getJobsStatusCounts: (
    startDate: string,
    endDate: string,
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: JOBS.JOBS_STATUS_COUNT,
      method: 'GET',
      params: {
        start_date: startDate,
        end_date: endDate
      },
      callbacks
    });
  },

  getJobsUnassignedCounts: (
    startDate: string,
    endDate: string,
    callbacks?: ApiCallbacks
  ) => {
    return apiRequest({
      url: JOBS.JOBS_UNASSIGNED_COUNT,
      method: 'GET',
      params: {
        start_date: startDate,
        end_date: endDate
      },
      callbacks
    });
  }
};
