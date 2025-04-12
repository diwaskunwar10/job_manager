import React from 'react';
import { Project } from '@/services/projectService';
import { Button } from '@/components/ui/button';
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
  // Generate pagination component
  const renderPagination = () => {
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(meta.totalPages, startPage + 4);

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1 && !isLoading) {
                  onPageChange(currentPage - 1);
                }
              }}
              className={currentPage === 1 || isLoading ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
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

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < meta.totalPages && !isLoading) {
                  onPageChange(currentPage + 1);
                }
              }}
              className={currentPage === meta.totalPages || isLoading ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Projects</h2>
        <p className="text-sm text-gray-500 mt-2">
          {meta.total} projects found
        </p>
      </div>

      <div className="flex-grow overflow-auto" style={{ height: 'calc(100% - 160px)', maxHeight: 'calc(100% - 80px)', paddingBottom: '60px' }}>
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

      <div className="p-4 border-t bg-white absolute bottom-0 left-0 right-0">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {onPageSizeChange && (
            <div className="w-full md:w-auto">
              <Select
                value={String(meta.pageSize)}
                onValueChange={(value) => onPageSizeChange(Number(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Page Size" />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map(size => (
                    <SelectItem key={size} value={String(size)}>{size} per page</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
