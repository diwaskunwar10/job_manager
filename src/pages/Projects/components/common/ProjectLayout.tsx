/**
 * Project Layout Component
 *
 * Main layout component for the Projects module. This component structures the Projects page
 * with three columns: project list, project details, and job output view.
 */

import React, { useState } from 'react';
import { Project, ProjectDetail, JobOutputInfo, ViewState } from '../../types';
import ProjectList from '../list/ProjectList';
import ProjectDetailView from '../detail/ProjectDetail';
import ProjectsHeader from '../list/ProjectsHeader';
import FilterBar from '../list/FilterBar';
import JobOutputView from '../jobs/JobOutputView';

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
  onProjectCreated?: (project: { _id: string; name: string }) => void;
}

const ProjectLayout: React.FC<ProjectLayoutProps> = (props) => {
  const {
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
    onResetFilters,
    onProjectCreated
  } = props;

  // State to track the current view (projects or job output)
  const [currentView, setCurrentView] = useState<ViewState>('projects');
  const [selectedJobInfo, setSelectedJobInfo] = useState<JobOutputInfo | null>(null);

  // Handle job output view
  const handleViewJobOutput = (jobId: string, jobName: string) => {
    setSelectedJobInfo({ jobId, jobName });
    setCurrentView('job-output');
  };

  // Handle back navigation from job output
  const handleBackFromJobOutput = () => {
    setCurrentView('projects');
    setSelectedJobInfo(null);
  };

  return (
    <div className="space-y-4">
      <ProjectsHeader
        tenantName={tenantName}
        onProjectCreated={onProjectCreated}
        selectedProjectId={selectedProjectId}
      />

      {currentView === 'projects' ? (
        <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-150px)]" style={{ minHeight: '600px' }}>
          {/* Project List - Left Side */}
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
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
              onProjectCreated={onProjectCreated}
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
          <div className="w-full md:w-2/3 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <ProjectDetailView
              project={projectDetail}
              isLoading={isDetailLoading}
              onViewJobOutput={handleViewJobOutput}
              onProjectUpdated={onProjectCreated}
              onProjectDeleted={() => {
                // Clear selected project and refresh projects list
                onProjectSelect('');
                // Trigger a refresh of the projects list
                onApplyFilters();
              }}
              onJobCreated={() => {
                // Refresh the project details to show the new job
                if (projectDetail) {
                  onProjectSelect(projectDetail._id);
                }
              }}
            />
          </div>
        </div>
      ) : currentView === 'job-output' && selectedJobInfo && projectDetail ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-150px)]" style={{ minHeight: '600px' }}>
          <JobOutputView
            jobId={selectedJobInfo.jobId}
            jobName={selectedJobInfo.jobName}
            projectId={projectDetail._id}
            projectName={projectDetail.name}
            onBack={handleBackFromJobOutput}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ProjectLayout;
