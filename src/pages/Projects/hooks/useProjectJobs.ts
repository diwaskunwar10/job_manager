import { useState, useEffect, useCallback } from 'react';
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
    page_size: 10
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch jobs with current filter
  const fetchJobs = useCallback(async () => {
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

    try {
      setIsLoading(true);

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
  }, []);

  // Fetch jobs when projectId or filter changes
  useEffect(() => {
    // Always call fetchJobs - it will handle the case when projectId is undefined
    fetchJobs();
  }, [projectId, filter, fetchJobs]);

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
