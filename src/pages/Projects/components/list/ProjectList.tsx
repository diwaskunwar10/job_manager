/**
 * Project List Component
 *
 * Displays a list of projects with pagination controls.
 * This component is used in the left column of the Projects page.
 */

import React, { useState, useEffect } from 'react';
import { Project, ProjectsMeta } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
  currentPage: number;
  meta: ProjectsMeta;
  onPageChange: (page: number) => void;
  onProjectSelect: (id: string) => void;
  selectedProjectId?: string;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isLoading,
  currentPage,
  meta,
  onPageChange,
  onProjectSelect,
  selectedProjectId,
  pageSizeOptions = [5, 10, 20, 50],
  onPageSizeChange
}) => {
  // State to track filtered projects
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  // Update filtered projects when projects prop changes
  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  // Generate pagination component
  const renderPagination = () => {
    // Ensure totalPages is at least 1 to avoid division by zero
    const totalPages = Math.max(1, meta.totalPages);

    return (
      <div className="flex items-center space-x-2 text-sm">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // Check if previous page is valid (greater than or equal to 1)
                  const prevPage = currentPage - 1;
                  if (prevPage >= 1 && !isLoading) {
                    onPageChange(prevPage);
                  }
                }}
                className={`rounded-lg ${currentPage <= 1 || isLoading ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50 transition-colors'}`}
              />
            </PaginationItem>

            {/* First page */}
            {currentPage > 2 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(1);
                    }}
                    className="rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <span className="px-2">...</span>
                </PaginationItem>
              </>
            )}

            {/* Current page (only show if not first or last) */}
            {currentPage > 1 && currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={true}
                  className="rounded-lg bg-primary/10 text-primary font-medium"
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Last page */}
            {currentPage < totalPages - 1 && (
              <>
                <PaginationItem>
                  <span className="px-2">...</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(totalPages);
                    }}
                    className="rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // Check if next page is valid (less than or equal to total pages)
                  const nextPage = currentPage + 1;
                  if (nextPage <= totalPages && !isLoading) {
                    onPageChange(nextPage);
                  }
                }}
                className={`rounded-lg ${currentPage >= totalPages || isLoading ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50 transition-colors'}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3 border-b">
        <p className="text-sm text-gray-500 font-medium">
          {meta.total} projects found
        </p>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-t-4 border-b-4 border-primary/70 rounded-full animate-spin"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <p className="text-gray-500 mb-2">No projects found</p>
              <p className="text-xs text-gray-400">Try adjusting your search criteria</p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredProjects.map((project) => (
              <li
                key={project._id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                  selectedProjectId === project._id ? 'bg-blue-50/70 border-l-4 border-primary' : ''
                }`}
                onClick={() => onProjectSelect(project._id)}
              >
                <div className="p-5">
                  <h3 className="text-md font-medium text-gray-900 mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sticky bottom-0 p-4 border-t bg-white mt-auto">
        <div className="flex justify-between items-center">
          {onPageSizeChange && (
            <Select
              value={String(meta.pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-[80px] rounded-lg text-xs">
                <SelectValue placeholder="Items" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
