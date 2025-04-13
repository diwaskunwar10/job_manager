
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/hooks';
import { fetchJobDetail } from '../../../redux/slices/jobsSlice';
import { fetchAssignedAgents, assignAgent, unassignAgent } from '../../../redux/slices/agentsSlice';
import JobList from './JobList';
import AssignmentPanel from './AssignmentPanel';
import AgentList from './AgentList';
import { Job } from '../../../types/job';
import { Agent } from '../../../types/agent';
import { JobsFilter } from '../../../redux/slices/jobsSlice';

interface JobComponentProps {
  jobs: Job[];
  selectedJob: Job | null;
  agents: Agent[];
  assignedAgents: Agent[];
  isJobsLoading: boolean;
  isJobDetailLoading: boolean;
  isAgentsLoading: boolean;
  isAssignedAgentsLoading: boolean;
  filter: JobsFilter;
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  tenantName: string;
  slug?: string;
  onFilterChange: (filter: Partial<JobsFilter>) => void;
}

const JobComponent: React.FC<JobComponentProps> = ({
  jobs,
  selectedJob,
  agents,
  assignedAgents,
  isJobsLoading,
  isJobDetailLoading,
  isAgentsLoading,
  isAssignedAgentsLoading,
  filter,
  meta,
  tenantName,
  slug,
  onFilterChange
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Handle job selection
  const handleJobSelect = (jobId: string) => {
    dispatch(fetchJobDetail(jobId));
    dispatch(fetchAssignedAgents(jobId));
  };
  
  // Handle agent assignment
  const handleAssignAgent = (jobId: string, agentId: string) => {
    dispatch(assignAgent({ jobId, agentId }));
  };
  
  // Handle agent unassignment
  const handleUnassignAgent = (jobId: string, agentId: string) => {
    dispatch(unassignAgent({ jobId, agentId }));
  };
  
  // Handle view output
  const handleViewOutput = (jobId: string) => {
    navigate(`/${slug}/jobs/${jobId}/output`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Job Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage jobs and assign agents for {tenantName}.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-150px)]" style={{ minHeight: '600px' }}>
        {/* Left Column - Job List */}
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
          <JobList
            jobs={jobs}
            isLoading={isJobsLoading}
            selectedJobId={selectedJob?._id}
            currentPage={filter.page}
            totalPages={meta.totalPages}
            onJobSelect={handleJobSelect}
            onPageChange={(page) => onFilterChange({ page })}
            onPageSizeChange={(pageSize) => onFilterChange({ pageSize })}
            onFilterChange={onFilterChange}
            onViewOutput={handleViewOutput}
          />
        </div>

        {/* Middle Column - Assignment */}
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
          <AssignmentPanel
            selectedJob={selectedJob}
            isLoading={isJobDetailLoading || isAssignedAgentsLoading}
            assignedAgents={assignedAgents}
            onUnassignAgent={handleUnassignAgent}
            onViewOutput={handleViewOutput}
          />
        </div>

        {/* Right Column - Agent List */}
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
          <AgentList
            agents={agents}
            isLoading={isAgentsLoading}
            selectedJobId={selectedJob?._id}
            assignedAgentIds={assignedAgents.map(a => a._id)}
            onAssignAgent={handleAssignAgent}
          />
        </div>
      </div>
    </div>
  );
};

export default JobComponent;
