/**
 * useProjectJobs Hook
 *
 * Custom hook for managing project jobs data and operations.
 * Handles fetching jobs, pagination, filtering, and job details.
 */

import { useState, useCallback } from 'react';
import { projectService } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { Job, JobsFilter } from '../types';

interface JobsMeta {
  total: number;
  page: number;
  page_size: number;
}

export const useProjectJobs = (projectId?: string, initialFilter?: Partial<JobsFilter>) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<JobsFilter>({
    page: initialFilter?.page || 1,
    pageSize: initialFilter?.pageSize || 10,
    jobStatus: initialFilter?.jobStatus,
    searchQuery: initialFilter?.searchQuery,
  });
  const [meta, setMeta] = useState<JobsMeta & {projectId?: string}>({
    total: 0,
    page: 1,
    page_size: 10,
  });
  const { toast } = useToast();

  // Fetch jobs based on current filters
  const fetchJobs = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const response = await projectService.getJobsByProject(projectId, filter);
      setJobs(response.data || []);

      // Update meta information
      if (response.meta) {
        setMeta({
          total: response.meta.total || 0,
          page: response.meta.page || 1,
          page_size: response.meta.page_size || 10,
          projectId,
        });
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load jobs. Please try again.',
        variant: 'destructive',
      });
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, filter, toast]);

  // Update filter and trigger a re-fetch
  const updateFilter = useCallback((newFilter: Partial<JobsFilter>) => {
    setFilter(prev => ({
      ...prev,
      ...newFilter,
      // If filter changes other than page, reset to page 1
      page: 'page' in newFilter ? newFilter.page! :
        ('jobStatus' in newFilter || 'verified' in newFilter ||
        'searchQuery' in newFilter || 'pageSize' in newFilter) ? 1 : prev.page,
    }));
  }, []);

  return {
    jobs,
    isLoading,
    meta,
    filter,
    updateFilter,
    fetchJobs,
  };
};
