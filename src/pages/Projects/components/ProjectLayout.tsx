
import React from 'react';
import { Project, ProjectDetail } from '@/services/projectService';
import ProjectList from './ProjectList';
import ProjectDetailView from './ProjectDetail';
import ProjectsHeader from './ProjectsHeader';
import FilterBar from './FilterBar';

interface ProjectLayoutProps {
  projects: Project[];
  projectDetail: ProjectDetail | null;
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  isLoading: boolean;
  isDetailLoading: boolean;
  currentPage: number;
  selectedProjectId: string | null;
  searchTerm: string;
  sortDirection: 'asc' | 'desc';
  startDate: Date | undefined;
  endDate: Date | undefined;
  tenantName: string;
  onPageChange: (page: number) => void;
  onProjectSelect: (id: string) => void;
  onPageSizeChange: (size: number) => void;
  onSearchTermChange: (term: string) => void;
  onSortDirectionToggle: () => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const ProjectLayout: React.FC<ProjectLayoutProps> = ({
  projects,
  projectDetail,
  meta,
  isLoading,
  isDetailLoading,
  currentPage,
  selectedProjectId,
  searchTerm,
  sortDirection,
  startDate,
  endDate,
  tenantName,
  onPageChange,
  onProjectSelect,
  onPageSizeChange,
  onSearchTermChange,
  onSortDirectionToggle,
  onStartDateChange,
  onEndDateChange,
  onApplyFilters,
  onResetFilters
}) => {
  return (
    <div className="space-y-4">
      <ProjectsHeader tenantName={tenantName} />

      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-150px)]" style={{ minHeight: '600px' }}>
        {/* Project List - Left Side */}
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
          {/* Filter Controls */}
          <FilterBar 
            searchTerm={searchTerm}
            sortDirection={sortDirection}
            startDate={startDate}
            endDate={endDate}
            onSearchTermChange={onSearchTermChange}
            onSortDirectionToggle={onSortDirectionToggle}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
            onApplyFilters={onApplyFilters}
            onResetFilters={onResetFilters}
          />

          <ProjectList
            projects={projects}
            isLoading={isLoading}
            currentPage={currentPage}
            meta={meta}
            onPageChange={onPageChange}
            onProjectSelect={onProjectSelect}
            selectedProjectId={selectedProjectId || undefined}
            pageSizeOptions={[5, 10, 20, 50]}
            onPageSizeChange={onPageSizeChange}
          />
        </div>

        {/* Project Detail - Right Side */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md overflow-hidden">
          <ProjectDetailView
            project={projectDetail}
            isLoading={isDetailLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectLayout;
