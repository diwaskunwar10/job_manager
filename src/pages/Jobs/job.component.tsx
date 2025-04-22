import React, { useState, useEffect, useCallback, useRef } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import JobListComponent from './components/JobListComponent';
import AssignmentComponent from './components/AssignmentComponent';
import AgentListComponent from './components/AgentListComponent';
import JobService from '../../services/jobService';
import { Job } from '../../types/job';
import { Agent } from '../../types/agent';

// Component props interface
interface JobComponentProps {
  tenantName: string;
}

const JobComponent: React.FC<JobComponentProps> = ({ tenantName }) => {
  // State for jobs
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobDetailLoading, setIsJobDetailLoading] = useState(false);
  const [jobsCurrentPage, setJobsCurrentPage] = useState(1);
  const [jobsTotalPages, setJobsTotalPages] = useState(1);
  const [jobsPageSize, setJobsPageSize] = useState(10);

  // Filter state
  const [jobFilters, setJobFilters] = useState<Record<string, any>>({});

  // Refs to prevent multiple API calls
  const isInitialJobsFetchDone = useRef(false);
  const isJobsFetchInProgress = useRef(false);

  // State for agents
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isAgentsLoading, setIsAgentsLoading] = useState(true);
  const [assignedAgents, setAssignedAgents] = useState<Agent[]>([]);
  const [agentsCurrentPage, setAgentsCurrentPage] = useState(1);
  const [agentsTotalPages, setAgentsTotalPages] = useState(1);
  const [agentsPageSize, setAgentsPageSize] = useState(10);

  // Refs to prevent multiple agent API calls
  const isInitialAgentsFetchDone = useRef(false);
  const isAgentsFetchInProgress = useRef(false);

  // Define fetchJobs function outside useEffect to avoid recreation
  // Use a ref for the latest filters to avoid dependency on jobFilters
  const latestFilters = useRef(jobFilters);

  // Update the ref whenever jobFilters changes
  useEffect(() => {
    latestFilters.current = jobFilters;
  }, [jobFilters]);

  const fetchJobs = useCallback(async () => {
    // Prevent concurrent API calls
    if (isJobsFetchInProgress.current) {
      console.log('Jobs fetch already in progress, skipping...');
      return;
    }

    isJobsFetchInProgress.current = true;
    setIsJobsLoading(true);

    try {
      // Use the current page, pageSize, and the latest filters from the ref
      const currentPage = jobsCurrentPage;
      const currentPageSize = jobsPageSize;
      const currentFilters = latestFilters.current;

      console.log('Fetching jobs with params:', { page: currentPage, pageSize: currentPageSize, ...currentFilters });
      const response = await JobService.getJobs(currentPage, currentPageSize, currentFilters);

      if (response && response.data) {
        setJobs(response.data);

        // Set pagination data from meta
        if (response.meta) {
          setJobsTotalPages(response.meta.total_pages || 1);
        }
      } else {
        console.error('Unexpected API response format:', response);
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setIsJobsLoading(false);
      isJobsFetchInProgress.current = false;
    }
  }, [jobsCurrentPage, jobsPageSize]); // Removed jobFilters from dependencies

  // Fetch jobs only on initial load
  useEffect(() => {
    if (!isInitialJobsFetchDone.current) {
      console.log('Initial jobs fetch');
      fetchJobs();
      isInitialJobsFetchDone.current = true;
    }
  }, [fetchJobs]);

  // Define fetchAgents function outside useEffect to avoid recreation
  const fetchAgents = useCallback(async () => {
      // Prevent concurrent API calls
      if (isAgentsFetchInProgress.current) {
        console.log('Agents fetch already in progress, skipping...');
        return;
      }

      isAgentsFetchInProgress.current = true;
      setIsAgentsLoading(true);
      try {
        const response = await JobService.getAllAgents();

        if (response) {
          // Check if response has agents array
          if (Array.isArray(response.agents)) {
            setAgents(response.agents);

            // Calculate total pages based on total agents count if available
            if (response.total_agents) {
              setAgentsTotalPages(Math.ceil(response.total_agents / agentsPageSize));
            } else {
              // Fallback to calculating based on array length
              setAgentsTotalPages(Math.ceil(response.agents.length / agentsPageSize));
            }
          }
          // Alternative response format check
          else if (Array.isArray(response.data)) {
            setAgents(response.data);

            // If there's pagination in the response
            if (response.meta && response.meta.total_pages) {
              setAgentsTotalPages(response.meta.total_pages);
            } else {
              // Calculate based on array length
              setAgentsTotalPages(Math.ceil(response.data.length / agentsPageSize));
            }
          }
          // If response itself is an array
          else if (Array.isArray(response)) {
            setAgents(response);
            setAgentsTotalPages(Math.ceil(response.length / agentsPageSize));
          }
          else {
            console.error('Unexpected API response format for agents:', response);
            setAgents([]);
          }
        } else {
          console.error('Empty response from agents API');
          setAgents([]);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
        setAgents([]);
        // Fallback to mock data if API fails
        const mockAgents: Agent[] = Array.from({ length: 10 }, (_, i) => ({
          _id: `agent-${i + 1}`,
          username: `Agent ${i + 1}`,
          role: ['Developer', 'Tester', 'DevOps', 'Designer'][Math.floor(Math.random() * 4)],
          created_at: new Date().toISOString(),
          status: ['available', 'busy', 'offline'][Math.floor(Math.random() * 3)] as any,
          created_by: 'system'
        }));
        setAgents(mockAgents);
        setAgentsTotalPages(Math.ceil(mockAgents.length / agentsPageSize));
      } finally {
        setIsAgentsLoading(false);
        isAgentsFetchInProgress.current = false;
      }
  }, [agentsPageSize]);

  // Fetch agents only on initial load
  useEffect(() => {
    if (!isInitialAgentsFetchDone.current) {
      console.log('Initial agents fetch');
      fetchAgents();
      isInitialAgentsFetchDone.current = true;
    }
  }, [fetchAgents]);

  // Handle job selection
  const handleJobSelect = async (jobId: string) => {
    setSelectedJobId(jobId);
    setIsJobDetailLoading(true);

    try {
      // Fetch job details from API
      const jobResponse = await JobService.getJobById(jobId);

      console.log('Job response from API:', jobResponse);
      if (jobResponse) {
        // Log the structure of the job data
        console.log('Job data structure:', {
          id: jobResponse.id,
          _id: jobResponse._id,
          // Log other properties to understand the structure
          keys: Object.keys(jobResponse)
        });
        setSelectedJob(jobResponse);
      } else {
        // Fallback to finding the job in the current list
        const job = jobs.find(j => j._id === jobId) || null;
        setSelectedJob(job);
      }

      // Try to fetch assigned agents for this job
      try {
        const agentsResponse = await JobService.getAssignedAgents(jobId);
        if (agentsResponse && agentsResponse.data) {
          setAssignedAgents(agentsResponse.data);
        } else {
          // Fallback to mock data if API doesn't return expected format
          const mockAssignedAgents = agents
            .filter(() => Math.random() > 0.7) // Randomly assign some agents
            .slice(0, 3); // Maximum 3 assigned agents
          setAssignedAgents(mockAssignedAgents);
        }
      } catch (agentError) {
        console.error('Error fetching assigned agents:', agentError);
        // Fallback to mock data
        const mockAssignedAgents = agents
          .filter(() => Math.random() > 0.7) // Randomly assign some agents
          .slice(0, 3); // Maximum 3 assigned agents
        setAssignedAgents(mockAssignedAgents);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      // Fallback to finding the job in the current list
      const job = jobs.find(j => j._id === jobId) || null;
      setSelectedJob(job);

      // Use mock assigned agents in case of error
      const mockAssignedAgents = agents
        .filter(() => Math.random() > 0.7) // Randomly assign some agents
        .slice(0, 3); // Maximum 3 assigned agents
      setAssignedAgents(mockAssignedAgents);
    } finally {
      setIsJobDetailLoading(false);
    }
  };

  // Handle agent assignment
  const handleAssignAgent = async (jobId: string, agentId: string) => {
    console.log('Assigning agent with params:', { jobId, agentId });

    // Check if jobId is undefined or null
    if (!jobId) {
      console.error('Cannot assign agent: Job ID is undefined or null');
      return;
    }

    // Check if agentId is undefined or null
    if (!agentId) {
      console.error('Cannot assign agent: Agent ID is undefined or null');
      return;
    }

    try {
      // Make API call to assign the agent
      const response = await JobService.assignAgentToJob(jobId, agentId);
      console.log('Assign agent response:', response);
      console.log(`Assigned agent ${agentId} to job ${jobId}`);

      // Add the agent to the UI
      const agentToAssign = agents.find(a => a._id === agentId);
      if (agentToAssign && !assignedAgents.some(a => a._id === agentId)) {
        setAssignedAgents([...assignedAgents, agentToAssign]);
      }

      // Optionally, you could refresh the job details to get the updated assigned agents
      // handleJobSelect(jobId);
    } catch (error) {
      console.error('Error assigning agent:', error);
      // You might want to show an error message to the user here
    }
  };

  // Handle removing agent from job
  const handleUnassignAgent = async (jobId: string, agentId: string) => {
    console.log('Removing agent with params:', { jobId, agentId });
    console.log('Current selected job:', selectedJob);

    // Check if jobId is undefined or null and try to use selectedJob._id as fallback
    if (!jobId && selectedJob) {
      console.log('Job ID is undefined, using selectedJob._id as fallback');
      console.log('selectedJob:', selectedJob);
      jobId = selectedJob._id || selectedJob.id;
    }

    // Final check if we have a valid job ID
    if (!jobId) {
      console.error('Job ID is still undefined or null after fallback');
      return;
    }

    try {
      // Make API call to remove the agent from the job
      await JobService.removeAgentFromJob(jobId, agentId);
      console.log(`Removed agent ${agentId} from job ${jobId}`);

      // Remove the agent from the UI
      setAssignedAgents(assignedAgents.filter(a => a._id !== agentId));

      // Optionally, you could refresh the job details to get the updated assigned agents
      // handleJobSelect(jobId);
    } catch (error) {
      console.error('Error removing agent:', error);
      // You might want to show an error message to the user here
    }
  };

  // Handle jobs pagination
  const handleJobsPageChange = (page: number) => {
    // Only fetch if the page has actually changed
    if (page !== jobsCurrentPage) {
      console.log(`Changing page from ${jobsCurrentPage} to ${page}`);
      setJobsCurrentPage(page);
      // Explicitly call fetchJobs when page changes
      setTimeout(() => fetchJobs(), 100);
    } else {
      console.log(`Page ${page} already selected, skipping fetch`);
    }
  };

  // Handle jobs page size change
  const handleJobsPageSizeChange = (size: number) => {
    // Only fetch if the page size has actually changed
    if (size !== jobsPageSize) {
      console.log(`Changing page size from ${jobsPageSize} to ${size}`);
      setJobsPageSize(size);
      setJobsCurrentPage(1);
      // Explicitly call fetchJobs when page size changes
      setTimeout(() => fetchJobs(), 100);
    } else {
      console.log(`Page size ${size} already selected, skipping fetch`);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filters: Record<string, any>) => {
    // Check if filters have actually changed
    const currentFilters = latestFilters.current;
    const hasChanged = Object.keys(filters).some(key => {
      return filters[key] !== currentFilters[key];
    }) || Object.keys(currentFilters).some(key => {
      return !filters.hasOwnProperty(key) && currentFilters[key] !== undefined;
    });

    if (hasChanged) {
      console.log('Filters have changed, updating and fetching jobs');
      setJobFilters(filters);
      setJobsCurrentPage(1); // Reset to first page when filters change

      // Explicitly call fetchJobs when filters change, with a small delay to ensure state updates
      setTimeout(() => fetchJobs(), 100);
    } else {
      console.log('Filters have not changed, skipping fetch');
    }
  };

  // Handle agents pagination
  const handleAgentsPageChange = (page: number) => {
    setAgentsCurrentPage(page);
    // Note: We're using client-side pagination for agents
  };

  // Handle agents page size change
  const handleAgentsPageSizeChange = (size: number) => {
    setAgentsPageSize(size);
    setAgentsCurrentPage(1);
    // Explicitly call fetchAgents when page size changes
    setTimeout(() => fetchAgents(), 100);
  };

  return (
    <MainLayout>
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
            <JobListComponent
              jobs={jobs}
              isLoading={isJobsLoading}
              onJobSelect={handleJobSelect}
              selectedJobId={selectedJobId}
              currentPage={jobsCurrentPage}
              totalPages={jobsTotalPages}
              onPageChange={handleJobsPageChange}
              onPageSizeChange={handleJobsPageSizeChange}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Middle Column - Assignment */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
            <AssignmentComponent
              selectedJob={selectedJob}
              selectedJobId={selectedJobId}
              isLoading={isJobDetailLoading}
              assignedAgents={assignedAgents}
              onAssignAgent={handleAssignAgent}
              onUnassignAgent={handleUnassignAgent}
            />
          </div>

          {/* Right Column - Agent List */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
            <AgentListComponent
              agents={agents}
              isLoading={isAgentsLoading}
              selectedJobId={selectedJobId}
              assignedAgentIds={assignedAgents.map(a => a._id)}
              onAssignAgent={handleAssignAgent}
              currentPage={agentsCurrentPage}
              totalPages={agentsTotalPages}
              onPageChange={handleAgentsPageChange}
              onPageSizeChange={handleAgentsPageSizeChange}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobComponent;