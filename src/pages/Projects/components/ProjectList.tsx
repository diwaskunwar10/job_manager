import React from 'react';
import { Project } from '@/services/projectService';
import { Button } from '@/components/ui/button';

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
  currentPage: number;
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onProjectSelect: (id: string) => void;
  selectedProjectId?: string;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isLoading,
  currentPage,
  meta,
  onPageChange,
  onProjectSelect,
  selectedProjectId
}) => {
  // Generate pagination buttons
  const renderPagination = () => {
    const buttons = [];

    // Previous button
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="px-3"
      >
        &lt;
      </Button>
    );

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(meta.totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i)}
          disabled={isLoading}
          className="px-3"
        >
          {i}
        </Button>
      );
    }

    // Next button
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === meta.totalPages || isLoading}
        className="px-3"
      >
        &gt;
      </Button>
    );

    return buttons;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Projects</h2>
        <p className="text-sm text-gray-500">
          {meta.total} projects found
        </p>
      </div>

      <div className="flex-grow overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p>No projects found</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <li
                key={project._id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedProjectId === project._id ? 'bg-blue-50' : ''
                }`}
                onClick={() => onProjectSelect(project._id)}
              >
                <div className="p-4">
                  <h3 className="text-md font-medium text-gray-900">{project.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {meta.totalPages > 1 && (
        <div className="p-4 border-t flex justify-center space-x-1">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
