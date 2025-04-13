
import React from 'react';
import { ProjectDetail as ProjectDetailType } from '@/services/projectService';

interface ProjectDetailsTabProps {
  project: ProjectDetailType;
}

const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({ project }) => {
  return (
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
  );
};

export default ProjectDetailsTab;
