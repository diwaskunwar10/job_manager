
import React from 'react';

interface ProjectsHeaderProps {
  tenantName: string;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ tenantName }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Projects</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage and view all projects for {tenantName}.
      </p>
    </div>
  );
};

export default ProjectsHeader;
