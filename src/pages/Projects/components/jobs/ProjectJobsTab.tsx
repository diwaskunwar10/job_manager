/**
 * Project Jobs Tab Component
 * 
 * Displays the jobs tab content for a project, including a list of jobs
 * with filtering and pagination.
 */

import React, { useEffect } from 'react';
import ProjectJobs from './ProjectJobs';
import { useProjectJobs } from '../../hooks/useProjectJobs';
import { Job } from '../../types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { saveNavigationState } from '@/redux/slices/projectJobsNavigationSlice';

interface ProjectJobsTabProps {
  projectId: string;
  onViewJobOutput?: (jobId: string, jobName: string) => void;
}

const ProjectJobsTab: React.FC<ProjectJobsTabProps> = ({ projectId, onViewJobOutput }) => {
  const dispatch = useAppDispatch();
  const savedNavigation = useAppSelector(state => state.projectJobsNavigation);

  // Initialize with saved state or default values
  const initialFilter = {
    page: savedNavigation.projectId === projectId ? savedNavigation.page : 1,
    pageSize: savedNavigation.projectId === projectId ? savedNavigation.pageSize : 10,
    jobStatus: savedNavigation.projectId === projectId ? savedNavigation.jobStatus : undefined,
    searchQuery: savedNavigation.projectId === projectId ? savedNavigation.searchQuery : undefined,
  };

  const {
    jobs,
    meta,
    isLoading,
    filter,
    updateFilter,
    fetchJobs
  } = useProjectJobs(projectId, initialFilter);

  useEffect(() => {
    if (projectId) {
      fetchJobs();
    }
  }, [projectId, fetchJobs]);

  // Save navigation state when filter changes
  useEffect(() => {
    if (projectId) {
      dispatch(saveNavigationState({
        activeTab: 'jobs',
        projectId,
        page: filter.page,
        pageSize: filter.pageSize,
        jobStatus: filter.jobStatus,
        searchQuery: filter.searchQuery,
      }));
    }
  }, [dispatch, projectId, filter]);

  return (
    <div className="flex-1 overflow-hidden">
      {projectId ? (
        <div className="h-full">
          <ProjectJobs
            jobs={jobs}
            isLoading={isLoading}
            filter={filter}
            meta={meta}
            onFilterChange={updateFilter}
            pageSizeOptions={[5, 10, 20, 50]}
            projectId={projectId}
            onViewJobOutput={onViewJobOutput}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full p-6">
          <p>Select a project to view jobs</p>
        </div>
      )}
    </div>
  );
};

export default ProjectJobsTab;
