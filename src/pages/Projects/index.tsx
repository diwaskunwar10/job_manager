import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import MainLayout from '../../components/Layout/MainLayout';
import ProjectList from '../Projects/components/ProjectList';
import ProjectDetail from '../Projects/components/ProjectDetail';
import { useProjects } from '../Projects/hooks/useProjects';

const ProjectsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State to track selected project
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Use custom hook to fetch projects
  const {
    projects,
    projectDetail,
    meta,
    isLoading,
    isDetailLoading,
    // fetchProjects is used indirectly via the useEffect dependency
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

  // Fetch project detail when selectedProjectId changes
  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectDetail(selectedProjectId);
    }
  }, [selectedProjectId, fetchProjectDetail]);

  // Fetch projects when page changes
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Only redirect if tenant not loaded, but allow unauthenticated users to view projects
  useEffect(() => {
    if (!state.tenant) {
      navigate(`/${slug}`);
      return;
    }

    // Don't redirect if not authenticated, just show the projects page
    // if (!state.isAuthenticated) {
    //   navigate(`/${slug}/login`);
    //   return;
    // }
  }, [slug, navigate, state.tenant]);

  if (!state.tenant) {
    return null; // Don't render until tenant is loaded
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all projects for {state.tenant.name}.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-150px)]" style={{ minHeight: '600px' }}>
          {/* Project List - Left Side */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
            <ProjectList
              projects={projects}
              isLoading={isLoading}
              currentPage={currentPage}
              meta={meta}
              onPageChange={handlePageChange}
              onProjectSelect={handleProjectSelect}
              selectedProjectId={selectedProjectId}
              pageSizeOptions={[5, 10, 20, 50]}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
          {/* Project Detail - Right Side */}

          <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md overflow-hidden">
            <ProjectDetail
              project={projectDetail}
              isLoading={isDetailLoading}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectsPage;
