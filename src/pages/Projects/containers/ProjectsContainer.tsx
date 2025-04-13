
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { useProjects } from '../hooks/useProjects';
import ProjectLayout from '../components/ProjectLayout';

const ProjectsContainer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();

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
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
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
    />
  );
};

export default ProjectsContainer;
