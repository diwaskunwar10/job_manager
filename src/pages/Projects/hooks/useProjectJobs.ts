
import { useState, useCallback } from 'react';
import { Job as JobType } from '@/types/job';
import { projectService } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';

export interface JobsFilter {
  jobStatus?: 'pending' | 'failed' | 'completed' | 'in-progress';
  verified?: boolean;
  searchQuery?: string;
  page: number;
  pageSize: number;
}

interface JobsMeta {
  total: number;
  page: number;
  page_size: number;
}

export const useProjectJobs = (projectId?: string) => {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<JobsFilter>({
    page: 1,
    pageSize: 10,
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
