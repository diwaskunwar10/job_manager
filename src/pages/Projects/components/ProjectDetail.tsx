import React, { useState, useEffect, useRef } from 'react';
import { ProjectDetail as ProjectDetailType } from '@/services/projectService';
import ProjectJobs from './ProjectJobs';
import { useProjectJobs } from '../hooks/useProjectJobs';

interface ProjectDetailProps {
  project: ProjectDetailType | null;
  isLoading: boolean;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, isLoading }) => {

  const [activeTab, setActiveTab] = useState('details');
  const prevProjectIdRef = useRef<string | undefined>(undefined);

  // Use the custom hook to fetch jobs for the selected project
  const {
    jobs,
    meta,
    isLoading: isJobsLoading,
    filter,
    updateFilter,
    fetchJobs
  } = useProjectJobs(project?._id);

  // Fetch jobs when project changes or tab changes to jobs
  useEffect(() => {
    // If project ID changed, fetch jobs regardless of active tab
    if (project?._id && project._id !== prevProjectIdRef.current) {
      console.log(`Project changed to ${project._id}, fetching jobs...`);
      fetchJobs();
      prevProjectIdRef.current = project._id;
    }
    // Also fetch when tab changes to jobs
    else if (activeTab === 'jobs' && project?._id) {
      console.log(`Tab changed to jobs for project ${project._id}, fetching jobs...`);
      fetchJobs();
    }
  }, [activeTab, project, fetchJobs]);

  // Log project details for debugging
  useEffect(() => {
    if (project) {
      console.log('Project details:', project);
    }
  }, [project]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h3 className="text-lg font-medium text-gray-900">No Project Selected</h3>
        <p className="mt-2 text-sm text-gray-500">
          Select a project from the list to view its details.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
        <div className="mt-2 flex items-center">
          {project.status && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              project.status === 'Completed' ? 'bg-green-100 text-green-800' :
              project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {project.status}
            </span>
          )}

          {project.assignedTo && (
            <span className="ml-3 text-sm text-gray-500">
              Assigned to: {project.assignedTo}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b px-6">
          <div className="flex space-x-2 border-b">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={(e) => {
                e.preventDefault();
                console.log('Details tab clicked');
                setActiveTab('details');
              }}
            >
              Details
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'jobs' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={(e) => {
                e.preventDefault();
                console.log('Jobs tab clicked, using custom handler');
                setActiveTab('jobs');
              }}
            >
              Jobs
            </button>
          </div>
        </div>

        {activeTab === 'details' && (
          <div className="flex-1 overflow-auto p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {project.description || 'No description provided.'}
              </p>
            </div>

            {(project.startDate || project.endDate) && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Timeline</h3>
                <div className="grid grid-cols-2 gap-4">
                  {project.startDate && (
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">{project.startDate}</p>
                    </div>
                  )}

                  {project.endDate && (
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">{project.endDate}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {project.progress !== undefined && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-sm text-right">{project.progress}% Complete</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="flex-1 overflow-hidden">
            {project?._id ? (
              <ProjectJobs
                jobs={jobs}
                isLoading={isJobsLoading}
                filter={filter}
                meta={meta}
                onFilterChange={updateFilter}
              />
            ) : (
              <div className="flex items-center justify-center h-full p-6">
                <p>Select a project to view jobs</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
