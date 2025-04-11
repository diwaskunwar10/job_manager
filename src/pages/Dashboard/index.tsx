
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import MainLayout from '../../components/Layout/MainLayout';
import { format, subDays } from 'date-fns';

// Import custom components
import DashboardHeader from './components/DashboardHeader';
import UserRoleDistribution from './components/UserRoleDistribution';
import AgentPerformance from './components/AgentPerformance';
import JobStatusOverview from './components/JobStatusOverview';
import SupervisorAssignments from './components/SupervisorAssignments';

// Import custom hooks
import { useDashboardData } from './hooks/useDashboardData';

const Dashboard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();

  // Get yesterday and today for default date range
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const today = format(new Date(), 'yyyy-MM-dd');

  const [dateRange, setDateRange] = useState({
    startDate: yesterday,
    endDate: today
  });

  // Use the custom hook to fetch and manage dashboard data
  const {
    roleData,
    agentData,
    supervisorData,
    jobsData,
    isLoading,
    fetchDashboardData
  } = useDashboardData(slug, dateRange);

  // Handler for date range update button
  const handleDateRangeUpdate = () => {
    fetchDashboardData();
  };

  // Redirect if tenant not loaded or not authenticated
  React.useEffect(() => {
    if (!state.tenant) {
      navigate(`/${slug}`);
      return;
    }

    if (!state.isAuthenticated) {
      navigate(`/${slug}/login`);
      return;
    }
  }, [slug, navigate, state.tenant, state.isAuthenticated]);

  if (!state.tenant) {
    return null; // Don't render until tenant is loaded
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with date selector */}
        <DashboardHeader
          tenantName={state.tenant.name}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onUpdate={handleDateRangeUpdate}
        />

        {/* Dashboard content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* User Role Distribution Chart */}
          <UserRoleDistribution data={roleData} isLoading={isLoading} />

          {/* Agent Performance Chart */}
          <AgentPerformance data={agentData} isLoading={isLoading} />

          {/* Job Status Overview */}
          <JobStatusOverview jobsData={jobsData} isLoading={isLoading} />

          {/* Supervisor Assignments Table */}
          <SupervisorAssignments data={supervisorData} isLoading={isLoading} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
