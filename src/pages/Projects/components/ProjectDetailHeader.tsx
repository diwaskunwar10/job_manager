import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ProjectDetail as ProjectDetailType } from '@/services/projectService';
import EditProjectDialog from './EditProjectDialog';
import DeleteProjectButton from './DeleteProjectButton';

interface ProjectDetailHeaderProps {
  project: ProjectDetailType;
  onNewJobClick: () => void;
  onProjectUpdated?: (project: any) => void;
  onProjectDeleted?: () => void;
}

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({
  project,
  onNewJobClick,
  onProjectUpdated,
  onProjectDeleted
}) => {
  return (
    <div className="p-6 border-b flex-shrink-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
        <div className="flex items-center gap-2">
          <EditProjectDialog
            projectId={project._id}
            projectData={{
              name: project.name,
              description: project.description
            }}
            onProjectUpdated={onProjectUpdated}
            trigger={
              <Button variant="outline" size="sm" className="flex items-center gap-1">
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
            className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> New Job
          </Button>
        </div>
      </div>
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
  );
};

export default ProjectDetailHeader;
