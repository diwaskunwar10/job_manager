
import { httpBase } from '../utils/httpBase';
import { Dispatch } from 'react';
import { Action } from '../types/dispatcherTypes';

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
  getUserRolesCount: async (
    startDate: string,
    endDate: string,
    dispatch?: Dispatch<Action>
  ): Promise<UserRoleCount[]> => {
    return httpBase.get<UserRoleCount[]>(
      `/users/roles/count?start_date=${startDate}&end_date=${endDate}`,
      undefined,
      dispatch
    );
  },

  getAgentPerformance: async (
    startDate: string,
    endDate: string,
    dispatch?: Dispatch<Action>
  ): Promise<AgentPerformance[]> => {
    return httpBase.get<AgentPerformance[]>(
      `/agents/performance?start_date=${startDate}&end_date=${endDate}`,
      undefined,
      dispatch
    );
  },

  getSupervisorAssignments: async (
    startDate: string,
    endDate: string,
    dispatch?: Dispatch<Action>
  ): Promise<SupervisorAssignment[]> => {
    return httpBase.get<SupervisorAssignment[]>(
      `/supervisors/assignments?start_date=${startDate}&end_date=${endDate}`,
      undefined,
      dispatch
    );
  },

  getJobsVerifiedCounts: async (
    startDate: string,
    endDate: string,
    dispatch?: Dispatch<Action>
  ): Promise<JobsVerifiedCount> => {
    return httpBase.get<JobsVerifiedCount>(
      `/jobs/verified/counts?start_date=${startDate}&end_date=${endDate}`,
      undefined,
      dispatch
    );
  },

  getJobsStatusCounts: async (
    startDate: string,
    endDate: string,
    dispatch?: Dispatch<Action>
  ): Promise<JobsStatusCount> => {
    return httpBase.get<JobsStatusCount>(
      `/jobs/status/count?start_date=${startDate}&end_date=${endDate}`,
      undefined,
      dispatch
    );
  },

  getJobsUnassignedCounts: async (
    startDate: string,
    endDate: string,
    dispatch?: Dispatch<Action>
  ): Promise<JobsUnassignedCount> => {
    return httpBase.get<JobsUnassignedCount>(
      `/jobs/unassigned/count?start_date=${startDate}&end_date=${endDate}`,
      undefined,
      dispatch
    );
  }
};
