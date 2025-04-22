/**
 * Project Detail Header Component
 *
 * Displays the header for a project detail view, including the project name,
 * status, and action buttons for editing, deleting, and creating new jobs.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ProjectDetail as ProjectDetailType } from '../../types';
import EditProjectDialog from './EditProjectDialog';
import DeleteProjectButton from './DeleteProjectButton';

interface ProjectDetailHeaderProps {
  project: ProjectDetailType;
  onNewJobClick: () => void;
  onProjectUpdated?: (project: ProjectDetailType) => void;
  onProjectDeleted?: () => void;
}

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({
  project,
  onNewJobClick,
  onProjectUpdated,
  onProjectDeleted
}) => {
  return (
    <div className="p-6 border-b flex-shrink-0 bg-white">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{project.name}</h2>
          <div className="flex items-center gap-2">
            {project.status && (
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {project.status}
              </span>
            )}

            {project.assignedTo && (
              <span className="text-sm text-gray-500">
                Assigned to: {project.assignedTo}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <EditProjectDialog
            projectId={project._id}
            projectData={{
              name: project.name,
              description: project.description
            }}
            onProjectUpdated={onProjectUpdated}
            trigger={
              <Button variant="outline" size="sm" className="flex items-center gap-1 rounded-lg hover:bg-gray-100 transition-colors">
                <Edit className="h-4 w-4" /> Edit
              </Button>
            }
          />
          <DeleteProjectButton
            projectId={project._id}
            projectName={project.name}
            onProjectDeleted={onProjectDeleted}
          />
          <Button
            onClick={onNewJobClick}
            className="flex items-center gap-1 rounded-lg shadow-sm">
            <Plus className="h-4 w-4" /> New Job
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailHeader;
