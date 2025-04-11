
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import MainLayout from '../../components/Layout/MainLayout';
import { dashboardService } from '../../services/dashboardService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';

// Mock data for initial render (will be replaced by real data)
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

// Initial job status data
const initialJobsData = {
  verified: { count: 45 },
  status: { completed: 20, inProgress: 15, pending: 10 },
  unassigned: { count: 8 }
};

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get yesterday and today for default date range
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [dateRange, setDateRange] = useState({
    startDate: yesterday,
    endDate: today
  });
  
  // Data states
  const [roleData, setRoleData] = useState(initialRoleData);
  const [agentData, setAgentData] = useState(initialAgentData);
  const [supervisorData, setSupervisorData] = useState(initialSupervisorData);
  const [jobsData, setJobsData] = useState(initialJobsData);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // If tenant not loaded or not authenticated, redirect
    if (!state.tenant) {
      navigate(`/${slug}`);
      return;
    }
    
    if (!state.isAuthenticated) {
      navigate(`/${slug}/login`);
      return;
    }
    
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel
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
        
        // For demo purposes, we're using mock data as the API endpoint is not real
        // In a real app, you would use the fetched data directly
        console.log("Fetched data:", { 
          rolesData, 
          agentsData, 
          supervisorsData, 
          jobsVerifiedData,
          jobsStatusData,
          jobsUnassignedData
        });
        
        // Uncommment below lines and remove the mock data in a real app
        // setRoleData(rolesData);
        // setAgentData(agentsData);
        // setSupervisorData(supervisorsData);
        // setJobsData({
        //   verified: jobsVerifiedData,
        //   status: jobsStatusData,
        //   unassigned: jobsUnassignedData
        // });
        
        toast({
          title: "Dashboard Updated",
          description: "Dashboard data has been refreshed."
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        
        // Check if error is authentication related (401)
        if (error instanceof Error && error.message.includes('401')) {
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please login again.",
            variant: "destructive"
          });
          // Clear auth token and redirect to login
          localStorage.removeItem('authToken');
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
    
    fetchDashboardData();
  }, [slug, navigate, state.tenant, state.isAuthenticated, dateRange, toast]);
  
  const handleDateRangeUpdate = () => {
    // This will trigger the useEffect to fetch updated data with the new date range
    setIsLoading(true);
  };
  
  if (!state.tenant) {
    return null; // Don't render until tenant is loaded
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome to {state.tenant.name}'s performance dashboard. View key metrics and statistics.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={handleDateRangeUpdate}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700"
            >
              Update
            </button>
          </div>
        </div>
        
        {/* Dashboard content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* User Role Distribution */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-lg font-medium text-gray-900">User Role Distribution</h2>
            <div className="h-64">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="role"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          
          {/* Agent Performance */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Agent Performance</h2>
            <div className="h-64">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agentData.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="agent_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="calls_handled" fill="#8884d8" name="Calls Handled" />
                    <Bar dataKey="average_handling_time" fill="#82ca9d" name="Avg. Handling Time (min)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          
          {/* Job Status Overview */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Job Status Overview</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Jobs</p>
                <p className="text-2xl font-bold">{jobsData.verified.count}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Job Status</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <span className="font-medium">{jobsData.status.completed}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${(jobsData.status.completed / (jobsData.status.completed + jobsData.status.inProgress + jobsData.status.pending)) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>In Progress</span>
                      <span className="font-medium">{jobsData.status.inProgress}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(jobsData.status.inProgress / (jobsData.status.completed + jobsData.status.inProgress + jobsData.status.pending)) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Pending</span>
                      <span className="font-medium">{jobsData.status.pending}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(jobsData.status.pending / (jobsData.status.completed + jobsData.status.inProgress + jobsData.status.pending)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Unassigned Jobs</p>
                <p className="text-2xl font-bold">{jobsData.unassigned.count}</p>
              </div>
            </div>
          </div>
          
          {/* Supervisor Assignments */}
          <div className="p-6 bg-white rounded-lg shadow-md lg:col-span-2 xl:col-span-1">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Supervisor Assignments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Supervisor</th>
                    <th className="px-4 py-3">Team Size</th>
                    <th className="px-4 py-3">Active Projects</th>
                    <th className="px-4 py-3">Completion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center">Loading data...</td>
                    </tr>
                  ) : (
                    supervisorData.map((supervisor, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {supervisor.supervisor_name}
                        </td>
                        <td className="px-4 py-3">{supervisor.team_size}</td>
                        <td className="px-4 py-3">{supervisor.active_projects}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <span className="mr-2">{supervisor.completion_rate}%</span>
                            <div className="w-20 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-full bg-green-500 rounded-full" 
                                style={{ width: `${supervisor.completion_rate}%` }} 
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
