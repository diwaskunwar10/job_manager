
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
  }
};
