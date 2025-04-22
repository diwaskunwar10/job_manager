import React from 'react';
import NewProjectDialog from './NewProjectDialog';

interface ProjectsHeaderProps {
  tenantName: string;
  onProjectCreated?: (project: any) => void;
  selectedProjectId?: string | null;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  tenantName,
  onProjectCreated,
  selectedProjectId
}) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Projects</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and view all projects for {tenantName}.
        </p>
      </div>
      {/* New Project button removed from header */}
    </div>
  );
};

export default ProjectsHeader;
