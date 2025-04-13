
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from '@/redux/hooks';
import { fetchJobsByProject, setFilter, JobsFilter } from '@/redux/slices/jobsSlice';
import { projectService } from '@/services/projectService';
import { Job } from '@/types/job';
import { useToast } from '@/hooks/use-toast';

export const useProjectJobs = (projectId?: string) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  // State for jobs list
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    projectId: projectId || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter state
  const [filter, setJobsFilter] = useState<JobsFilter>({
    page: 1,
    pageSize: 10,
    jobStatus: undefined,
    verified: undefined,
    searchQuery: undefined
  });
  
  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    
    try {
      const options = {
        jobStatus: filter.jobStatus,
        verified: filter.verified,
        searchQuery: filter.searchQuery,
        page: filter.page,
        pageSize: filter.pageSize,
      };
      
      const response = await projectService.getJobsByProject(projectId, options);
      
      setJobs(response.data || []);
      
      // Map API response to expected format and include projectId
      const apiMeta = response.meta || {};
      setMeta({
        total: apiMeta.total || 0,
        page: apiMeta.page || 1,
        pageSize: apiMeta.page_size || 10,
        totalPages: apiMeta.total_pages || 1,
        projectId: projectId
      });
      
      toast({
        title: "Jobs Loaded",
        description: "Job list has been updated."
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      
      toast({
        title: "Error Loading Jobs",
        description: "Failed to load jobs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, filter, toast]);
  
  // Update filter and re-fetch jobs
  const updateFilter = useCallback((newFilter: Partial<JobsFilter>) => {
    setJobsFilter(prev => {
      // If changing page size, reset to page 1
      if (newFilter.pageSize && newFilter.pageSize !== prev.pageSize) {
        return { ...prev, ...newFilter, page: 1 };
      }
      return { ...prev, ...newFilter };
    });
  }, []);
  
  // Fetch jobs when filter changes or projectId changes
  useEffect(() => {
    if (projectId) {
      fetchJobs();
    }
  }, [projectId, filter, fetchJobs]);
  
  return {
    jobs,
    meta,
    isLoading,
    filter,
    updateFilter,
    fetchJobs
  };
};
