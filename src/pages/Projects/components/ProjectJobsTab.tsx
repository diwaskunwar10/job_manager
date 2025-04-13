
import React, { useEffect } from 'react';
import ProjectJobs from './ProjectJobs';
import { useProjectJobs } from '../hooks/useProjectJobs';
import { Job as JobType } from '@/types/job'; // Using Job from types/job.ts

interface ProjectJobsTabProps {
  projectId: string;
}

const ProjectJobsTab: React.FC<ProjectJobsTabProps> = ({ projectId }) => {
  const {
    jobs,
    meta,
    isLoading,
    filter,
    updateFilter,
    fetchJobs
  } = useProjectJobs(projectId);

  useEffect(() => {
    if (projectId) {
      console.log(`Loading jobs for project ${projectId}`);
      fetchJobs();
    }
  }, [projectId, fetchJobs]);

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
