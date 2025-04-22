/**
 * Project Details Tab Component
 *
 * Displays detailed information about a project, including description,
 * timeline, and progress.
 */

import React from 'react';
import { ProjectDetail as ProjectDetailType } from '../../types';

interface ProjectDetailsTabProps {
  project: ProjectDetailType;
}

const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({ project }) => {
  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {project.description || 'No description provided.'}
          </p>
        </div>

        {(project.startDate || project.endDate) && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
            <div className="grid grid-cols-2 gap-6">
              {project.startDate && (
                <div className="bg-gray-50/70 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Start Date</p>
                  <p className="font-medium text-gray-900">{project.startDate}</p>
                </div>
              )}

              {project.endDate && (
                <div className="bg-gray-50/70 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">End Date</p>
                  <p className="font-medium text-gray-900">{project.endDate}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {project.progress !== undefined && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress</h3>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm font-medium text-right">{project.progress}% Complete</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsTab;
