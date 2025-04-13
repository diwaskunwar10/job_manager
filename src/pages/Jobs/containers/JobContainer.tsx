
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchJobs, setFilter } from '../../../redux/slices/jobsSlice';
import { fetchAgents } from '../../../redux/slices/agentsSlice';
import JobComponent from '../components/JobComponent';
import { useToast } from '@/hooks/use-toast';

interface JobContainerProps {
  slug?: string;
  tenantName: string;
}

const JobContainer: React.FC<JobContainerProps> = ({ slug, tenantName }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    jobs, 
    selectedJob, 
    isLoading, 
    isJobDetailLoading, 
    filter, 
    meta, 
    error 
  } = useAppSelector(state => state.jobs);
  
  const { 
    agents, 
    assignedAgents, 
    isLoading: isAgentsLoading, 
    isAssignedAgentsLoading
  } = useAppSelector(state => state.agents);
  
  // Initial data fetch
  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchAgents());
  }, [dispatch]);
  
  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      
      // If it's an auth error, redirect to login
      if (error.includes('401') || error.includes('Unauthorized')) {
        navigate(`/${slug}/login`);
      }
    }
  }, [error, toast, navigate, slug]);
  
  // Handle filter changes
  const handleFilterChange = (newFilter: Partial<typeof filter>) => {
    dispatch(setFilter(newFilter));
    dispatch(fetchJobs());
  };

  return (
    <JobComponent
      jobs={jobs}
      selectedJob={selectedJob}
      agents={agents}
      assignedAgents={assignedAgents}
      isJobsLoading={isLoading}
      isJobDetailLoading={isJobDetailLoading}
      isAgentsLoading={isAgentsLoading}
      isAssignedAgentsLoading={isAssignedAgentsLoading}
      filter={filter}
      meta={meta}
      tenantName={tenantName}
      slug={slug}
      onFilterChange={handleFilterChange}
    />
  );
};

export default JobContainer;
