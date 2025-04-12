
import React, { useState, useEffect } from 'react';
import { Project } from '@/services/projectService';
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
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
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
  // Remove all filter-related state and logic
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  // Update filtered projects when projects prop changes
  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  // Generate pagination component
  const renderPagination = () => {
    // Ensure totalPages is at least 1 to avoid division by zero
    const totalPages = Math.max(1, meta.totalPages);
    const maxVisiblePages = 5; // Show max 5 page numbers

    // Calculate start and end page numbers for pagination display
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    console.log(`Pagination: currentPage=${currentPage}, totalPages=${totalPages}, startPage=${startPage}, endPage=${endPage}`);

    return (
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
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
                    console.log(`Navigating to page ${prevPage} of ${meta.totalPages}`);
                    onPageChange(prevPage);
                  }
                }}
                className={currentPage <= 1 || isLoading ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {startPage > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {startPage > 2 && (
                  <PaginationItem>
                    <span className="px-2">...</span>
                  </PaginationItem>
                )}
              </>
            )}

            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i
            ).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href="#"
                  isActive={pageNum === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isLoading) {
                      onPageChange(pageNum);
                    }
                  }}
                  className={isLoading ? 'pointer-events-none' : ''}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <PaginationItem>
                    <span className="px-2">...</span>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(totalPages);
                    }}
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
                    console.log(`Navigating to page ${nextPage} of ${totalPages}`);
                    onPageChange(nextPage);
                  }
                }}
                className={currentPage >= totalPages || isLoading ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <p className="text-sm text-gray-500">
          {meta.total} projects found
        </p>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-t-4 border-b-4 border-brand-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p>No projects found</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredProjects.map((project) => (
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

      <div className="sticky bottom-0 p-4 border-t bg-white mt-auto">
        <div className="flex justify-between items-center">
          {onPageSizeChange && (
            <Select
              value={String(meta.pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Page Size" />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={String(size)}>
                    {size} per page
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
