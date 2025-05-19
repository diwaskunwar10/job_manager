
/**
 * Projects Container
 *
 * Main container component for the Projects module. This component manages the state
 * and data flow for the Projects page, including pagination, filtering, and project selection.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { useProjects } from '../hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import ProjectLayout from '../components/common/ProjectLayout';
import { Project } from '../types';

const ProjectsContainer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State to track selected project
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Use custom hook to fetch projects
  const {
    projects,
    projectDetail,
    meta,
    isLoading,
    isDetailLoading,
    fetchProjects,
    fetchProjectDetail
  } = useProjects(slug, currentPage, pageSize);

  // Handle page change
  const handlePageChange = (page: number) => {
    console.log(`ProjectsContainer: Changing page from ${currentPage} to ${page}`);
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    console.log(`ProjectsContainer: Changing page size from ${pageSize} to ${size}`);
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size

    // Force a refresh of the projects list with the new page size
    // This is needed because the useEffect in useProjects might not trigger
    // if only pageSize changes but the dependency array doesn't catch it
    setTimeout(() => {
      fetchProjects();
    }, 0);
  };

  // Handle project selection
  const handleProjectSelect = (id: string) => {
    console.log(`Selected project: ${id}`);
    setSelectedProjectId(id);
    fetchProjectDetail(id);
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Apply filters
  const applyFilters = () => {
    // Explicitly call fetchProjects when filters are applied
    fetchProjects();
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStartDate(undefined);
    setEndDate(undefined);
    // Explicitly call fetchProjects when filters are reset
    fetchProjects();
  };

  // Handle project creation
  const handleProjectCreated = (project: Project) => {
    toast({
      title: "Project Created",
      description: `Project "${project.name}" has been created successfully.`
    });
    // Refresh projects list
    fetchProjects();
    // Select the newly created project
    if (project._id) {
      handleProjectSelect(project._id);
    }
  };

  // Redirect if tenant not loaded
  useEffect(() => {
    if (!state.tenant) {
      navigate(`/${slug}`);
      return;
    }
  }, [slug, navigate, state.tenant]);

  if (!state.tenant) {
    return null; // Don't render until tenant is loaded
  }

  return (
    <ProjectLayout
      projects={projects}
      projectDetail={projectDetail}
      meta={meta}
      isLoading={isLoading}
      isDetailLoading={isDetailLoading}
      currentPage={currentPage}
      selectedProjectId={selectedProjectId}
      searchTerm={searchTerm}
      sortDirection={sortDirection}
      startDate={startDate}
      endDate={endDate}
      tenantName={state.tenant.name}
      onPageChange={handlePageChange}
      onProjectSelect={handleProjectSelect}
      onPageSizeChange={handlePageSizeChange}
      onSearchTermChange={setSearchTerm}
      onSortDirectionToggle={toggleSortDirection}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onApplyFilters={applyFilters}
      onResetFilters={resetFilters}
      onProjectCreated={handleProjectCreated}
    />
  );
};

export default ProjectsContainer;
