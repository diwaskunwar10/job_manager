import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { dashboardService } from '@/services/dashboardService';

export interface DashboardData {
  roleData: Array<{ role: string; count: number }>;
  agentData: Array<{
    agent_name: string;
    calls_handled: number;
    average_handling_time: number;
    satisfaction_score: number;
  }>;
  supervisorData: Array<{
    supervisor_name: string;
    team_size: number;
    active_projects: number;
    completion_rate: number;
  }>;
  jobsData: {
    verified: { count: number };
    status: { completed: number; inProgress: number; pending: number };
    unassigned: { count: number };
  };
}

// Initialize with empty data structures instead of dummy data
const initialRoleData: Array<{ role: string; count: number }> = [];
const initialAgentData: Array<{
  agent_name: string;
  calls_handled: number;
  average_handling_time: number;
  satisfaction_score: number;
}> = [];
const initialSupervisorData: Array<{
  supervisor_name: string;
  team_size: number;
  active_projects: number;
  completion_rate: number;
}> = [];
const initialJobsData = {
  verified: { count: 0 },
  status: { completed: 0, inProgress: 0, pending: 0 },
  unassigned: { count: 0 }
};

export const useDashboardData = (slug: string | undefined, dateRange: { startDate: string; endDate: string }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [data, setData] = useState<DashboardData>({
    roleData: initialRoleData,
    agentData: initialAgentData,
    supervisorData: initialSupervisorData,
    jobsData: initialJobsData
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!slug) return;

    try {
      setIsLoading(true);

      // Fetch data from individual endpoints
      const [
        rolesData,
        agentsData,
        supervisorsData,
        jobsVerifiedData,
        jobsStatusData,
        jobsUnassignedData
      ] = await Promise.all([
        dashboardService.getUserRolesCount(dateRange.startDate, dateRange.endDate),
        dashboardService.getAgentPerformance(dateRange.startDate, dateRange.endDate),
        dashboardService.getSupervisorAssignments(dateRange.startDate, dateRange.endDate),
        dashboardService.getJobsVerifiedCounts(dateRange.startDate, dateRange.endDate),
        dashboardService.getJobsStatusCounts(dateRange.startDate, dateRange.endDate),
        dashboardService.getJobsUnassignedCounts(dateRange.startDate, dateRange.endDate)
      ]);

      console.log("Fetched data:", {
        rolesData,
        agentsData,
        supervisorsData,
        jobsVerifiedData,
        jobsStatusData,
        jobsUnassignedData
      });

      // Update the state with the new data
      setData({
        // Map role data
        roleData: Array.isArray(rolesData) ? rolesData.map(role => ({
          role: role.role,
          count: role.count
        })) : [],

        // Map agent data
        agentData: Array.isArray(agentsData) ? agentsData.map(agent => ({
          agent_name: agent.agent_name,
          calls_handled: agent.calls_handled || 0,
          average_handling_time: agent.average_handling_time || 0,
          satisfaction_score: agent.satisfaction_score || 0
        })) : [],

        // Map supervisor data
        supervisorData: Array.isArray(supervisorsData) ? supervisorsData.map(supervisor => ({
          supervisor_name: supervisor.supervisor_name,
          team_size: supervisor.team_size || 0,
          active_projects: supervisor.active_projects || 0,
          completion_rate: supervisor.completion_rate || 0
        })) : [],

        // Map jobs data
        jobsData: {
          verified: { count: jobsVerifiedData?.count || 0 },
          status: {
            completed: jobsStatusData?.completed || 0,
            inProgress: jobsStatusData?.inProgress || 0,
            pending: jobsStatusData?.pending || 0
          },
          unassigned: { count: jobsUnassignedData?.count || 0 }
        }
      });

      toast({
        title: "Dashboard Updated",
        description: "Dashboard data has been refreshed."
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      if (error instanceof Error && error.message.includes('401')) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive"
        });
        // Don't redirect, just show the error
        // navigate(`/${slug}/login`);
        // return;
      }

      toast({
        title: "Data Fetch Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [slug, dateRange]);

  return {
    ...data,
    isLoading,
    fetchDashboardData
  };
};
