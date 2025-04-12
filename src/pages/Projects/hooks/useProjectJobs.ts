import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { projectService, Job } from '@/services/projectService';

export interface JobsFilter {
  jobStatus?: 'pending' | 'failed' | 'completed' | 'in-progress';
  verified?: boolean;
  searchQuery?: string;
  page: number;
  pageSize: number;
}

export const useProjectJobs = (
  projectId: string | undefined
) => {
  const { toast } = useToast();

  // Default filter state
  const [filter, setFilter] = useState<JobsFilter>({
    page: 1,
    pageSize: 10
  });

  // Available page size options
  const pageSizeOptions = [5, 10, 20, 50];

  // Jobs data state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    page_size: 10,
    projectId: projectId // Include projectId in meta
  });

  // Update meta when projectId changes
  useEffect(() => {
    setMeta(prevMeta => ({
      ...prevMeta,
      projectId
    }));
  }, [projectId]);
  const [isLoading, setIsLoading] = useState(false);

  // Refs to prevent multiple API calls
  const isInitialFetchDone = useRef(false);
  const isFetchInProgress = useRef(false);
  const prevProjectId = useRef<string | undefined>(undefined);

  // Fetch jobs with current filter
  const fetchJobs = useCallback(async () => {
    // Prevent concurrent API calls
    if (isFetchInProgress.current) {
      console.log('Jobs fetch already in progress, skipping...');
      return;
    }

    if (!projectId) {
      // Clear jobs if no project ID is provided
      setJobs([]);
      setMeta({
        total: 0,
        page: 1,
        page_size: 10
      });
      return;
    }

    isFetchInProgress.current = true;
    setIsLoading(true);

    try {

      const apiParams = {
        jobStatus: filter.jobStatus,
        verified: filter.verified,
        searchQuery: filter.searchQuery,
        page: filter.page,
        pageSize: filter.pageSize
      };

      console.log(`Calling API: /jobs/${projectId} with filters:`, apiParams);
      console.log(`Current page being requested: ${filter.page}`);

      const response = await projectService.getJobsByProject(
        projectId,
        apiParams
      );

      console.log(`Fetched jobs for project ${projectId}:`, response);

      // Safely set jobs and meta data
      setJobs(response?.data || []);
      setMeta(response?.meta || {
        total: 0,
        page: 1,
        page_size: 10
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);

      if (error instanceof Error && error.message.includes('401')) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive"
        });
        // Don't redirect, just show the error
      } else {
        toast({
          title: "Error Loading Jobs",
          description: "Failed to load jobs for this project. Please try again.",
          variant: "destructive"
        });
      }

      // Set empty data on error
      setJobs([]);
      setMeta({
        total: 0,
        page: 1,
        page_size: 10
      });
    } finally {
      setIsLoading(false);
      isFetchInProgress.current = false;
    }
  }, [projectId, filter, toast]);

  // Update filter and fetch jobs
  const updateFilter = useCallback((newFilter: Partial<JobsFilter>) => {
    console.log('Updating filter with:', newFilter);

    setFilter(prevFilter => {
      // If page is explicitly provided, use it
      if ('page' in newFilter) {
        console.log(`Changing page from ${prevFilter.page} to ${newFilter.page}`);
        return {
          ...prevFilter,
          ...newFilter
        };
      }

      // Otherwise, if other filters change, reset to page 1
      const shouldResetPage = (
        'jobStatus' in newFilter ||
        'verified' in newFilter ||
        'searchQuery' in newFilter ||
        'pageSize' in newFilter
      );

      if (shouldResetPage) {
        console.log('Resetting page to 1 due to filter change');
      }

      return {
        ...prevFilter,
        ...newFilter,
        page: shouldResetPage ? 1 : prevFilter.page
      };
    });

    // Schedule fetchJobs to run after state update
    setTimeout(() => fetchJobs(), 100);
  }, [fetchJobs]);

  // Fetch jobs only on initial load or when projectId changes
  useEffect(() => {
    // Reset the initial fetch flag when projectId changes
    if (projectId !== prevProjectId.current) {
      isInitialFetchDone.current = false;
    }

    if (projectId && (!isInitialFetchDone.current || projectId !== prevProjectId.current)) {
      console.log('Initial or new project jobs fetch for project:', projectId);
      // Small delay to ensure all state updates have completed
      setTimeout(() => {
        fetchJobs();
        isInitialFetchDone.current = true;
        prevProjectId.current = projectId;
      }, 100);
    }
  }, [projectId, fetchJobs]); // Removed filter and initialLoadComplete from dependencies

  return {
    jobs,
    meta,
    isLoading,
    filter,
    updateFilter,
    fetchJobs,
    pageSizeOptions
  };
};
