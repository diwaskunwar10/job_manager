
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

// Initialize with empty data structures
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

    setIsLoading(true);
    
    // Create a function to handle common data setting logic
    const fetchDataWithCallbacks = (
      fetcher: (
        startDate: string, 
        endDate: string, 
        callbacks: any
      ) => Promise<any>,
      dataKey: keyof DashboardData,
      dataMapper: (responseData: any) => any
    ) => {
      return fetcher(
        dateRange.startDate, 
        dateRange.endDate, 
        {
          successCallback: (responseData: any) => {
            setData(prevData => ({
              ...prevData,
              [dataKey]: dataMapper(responseData)
            }));
          },
          failureCallback: (error: any) => {
            console.error(`Error fetching ${dataKey}:`, error);
            
            if (error instanceof Error && error.message.includes('401')) {
              toast({
                title: "Session Expired",
                description: "Your session has expired. Please login again.",
                variant: "destructive"
              });
            }
          }
        }
      );
    };

    try {
      // Fetch roles data
      fetchDataWithCallbacks(
        dashboardService.getUserRolesCount,
        'roleData',
        (responseData) => Array.isArray(responseData) ? responseData.map(role => ({
          role: role.role,
          count: role.count
        })) : []
      );

      // Fetch agent data
      fetchDataWithCallbacks(
        dashboardService.getAgentPerformance,
        'agentData',
        (responseData) => Array.isArray(responseData) ? responseData.map(agent => ({
          agent_name: agent.agent_name,
          calls_handled: agent.calls_handled || 0,
          average_handling_time: agent.average_handling_time || 0,
          satisfaction_score: agent.satisfaction_score || 0
        })) : []
      );

      // Fetch supervisor data
      fetchDataWithCallbacks(
        dashboardService.getSupervisorAssignments,
        'supervisorData',
        (responseData) => Array.isArray(responseData) ? responseData.map(supervisor => ({
          supervisor_name: supervisor.supervisor_name,
          team_size: supervisor.team_size || 0,
          active_projects: supervisor.active_projects || 0,
          completion_rate: supervisor.completion_rate || 0
        })) : []
      );

      // Fetch jobs verified count
      fetchDataWithCallbacks(
        dashboardService.getJobsVerifiedCounts,
        'jobsData',
        (responseData) => ({
          ...data.jobsData,
          verified: { count: responseData?.count || 0 }
        })
      );

      // Fetch jobs status count
      fetchDataWithCallbacks(
        dashboardService.getJobsStatusCounts,
        'jobsData',
        (responseData) => ({
          ...data.jobsData,
          status: {
            completed: responseData?.completed || 0,
            inProgress: responseData?.inProgress || 0,
            pending: responseData?.pending || 0
          }
        })
      );

      // Fetch jobs unassigned count
      fetchDataWithCallbacks(
        dashboardService.getJobsUnassignedCounts,
        'jobsData',
        (responseData) => ({
          ...data.jobsData,
          unassigned: { count: responseData?.count || 0 }
        })
      );

      toast({
        title: "Dashboard Updated",
        description: "Dashboard data has been refreshed."
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      
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
