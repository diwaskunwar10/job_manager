import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { dashboardService } from '@/services/dashboardService';
import { API_CONFIG } from '@/config/environment';

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

const initialRoleData = [
  { role: 'Agent', count: 45 },
  { role: 'Supervisor', count: 15 },
  { role: 'Manager', count: 5 },
  { role: 'Admin', count: 2 },
];

const initialAgentData = [
  { agent_name: 'John Doe', calls_handled: 120, average_handling_time: 3.5, satisfaction_score: 4.8 },
  { agent_name: 'Jane Smith', calls_handled: 105, average_handling_time: 2.8, satisfaction_score: 4.9 },
  { agent_name: 'Robert Johnson', calls_handled: 95, average_handling_time: 4.2, satisfaction_score: 4.5 },
  { agent_name: 'Emily Davis', calls_handled: 130, average_handling_time: 3.0, satisfaction_score: 4.7 },
  { agent_name: 'Michael Wilson', calls_handled: 110, average_handling_time: 3.2, satisfaction_score: 4.6 },
];

const initialSupervisorData = [
  { supervisor_name: 'Sarah Johnson', team_size: 12, active_projects: 4, completion_rate: 92 },
  { supervisor_name: 'David Williams', team_size: 15, active_projects: 5, completion_rate: 87 },
  { supervisor_name: 'Lisa Brown', team_size: 8, active_projects: 3, completion_rate: 95 },
];

const initialJobsData = {
  verified: { count: 45 },
  status: { completed: 20, inProgress: 15, pending: 10 },
  unassigned: { count: 8 }
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
        localStorage.removeItem(API_CONFIG.AUTH_TOKEN_KEY);
        navigate(`/${slug}/login`);
        return;
      }
      
      toast({
        title: "Data Fetch Error",
        description: "Failed to load dashboard data. Using cached data.",
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
