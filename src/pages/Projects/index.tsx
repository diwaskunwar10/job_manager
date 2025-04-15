
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import MainLayout from '../../components/Layout/MainLayout';
import ProjectList from '../Projects/components/ProjectList';
import ProjectDetail from '../Projects/components/ProjectDetail';
import { useProjects } from '../Projects/hooks/useProjects';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Search, ArrowUpDown, Plus } from 'lucide-react';
import { format } from 'date-fns';

const ProjectsPage: React.FC = () => {
  const { slug, projectId: urlProjectId, jobId: urlJobId } = useParams<{ slug: string; projectId?: string; jobId?: string }>();
  const { state } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // No longer need jobIdRef as we're passing initialJobId directly

  // State to track selected project
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Animation for search placeholder
  const [placeholder, setPlaceholder] = useState('');
  const fullPlaceholder = "Search projects...";
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

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

  // Animated placeholder effect
  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (placeholderIndex <= fullPlaceholder.length) {
        setPlaceholder(fullPlaceholder.substring(0, placeholderIndex));
        setPlaceholderIndex(prev => prev + 1);
      } else {
        clearInterval(typingInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, [placeholderIndex]);

  // Reset animation after it completes
  useEffect(() => {
    if (placeholderIndex > fullPlaceholder.length) {
      const resetTimeout = setTimeout(() => {
        setPlaceholderIndex(0);
      }, 2000);
      return () => clearTimeout(resetTimeout);
    }
  }, [placeholderIndex]);

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

  // Fetch project detail when selectedProjectId changes
  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectDetail(selectedProjectId);
    }
  }, [selectedProjectId, fetchProjectDetail]);

  // Select project from URL parameter when component mounts
  useEffect(() => {
    if (urlProjectId && urlProjectId !== selectedProjectId) {
      console.log(`Selecting project from URL: ${urlProjectId}`);
      setSelectedProjectId(urlProjectId);
      fetchProjectDetail(urlProjectId);
    }
  }, [urlProjectId, selectedProjectId, fetchProjectDetail]);

  // Handle job ID parameter if present - now handled by passing initialJobId to ProjectDetail

  // Handle location state when returning from job output page
  useEffect(() => {
    // Check if we're returning from the job output page
    if (location.state && typeof location.state === 'object') {
      const locationState = location.state as { returnedFromJobOutput?: boolean; pageNumber?: number };

      if (locationState.returnedFromJobOutput && locationState.pageNumber) {
        console.log(`Returning from job output page with page number: ${locationState.pageNumber}`);
        setCurrentPage(locationState.pageNumber);

        // Clear the location state to prevent reapplying on refresh
        navigate(location.pathname, { replace: true });
      }
    }
  }, [location, navigate]);

  // We don't need this effect anymore as fetchProjects is called in the hook
  // and will be called explicitly when filters change

  // Only redirect if tenant not loaded, but allow unauthenticated users to view projects
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
    <MainLayout>
      <div className="space-y-4">
        {/* Breadcrumb navigation */}
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
            {projectDetail && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{projectDetail.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all projects for {state.tenant.name}.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-150px)]" style={{ minHeight: '600px' }}>
          {/* Project List - Left Side */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
            {/* Filter Controls */}
            <div className="p-4 border-b space-y-3">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder={placeholder}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSortDirection}
                  title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm">
                      <Plus className="mr-1 h-4 w-4" />
                      New Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Project</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      {/* Project creation form would go here */}
                      <p className="text-sm text-gray-500">Project creation form placeholder</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      {startDate ? format(startDate, 'PP') : 'Start Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      {endDate ? format(endDate, 'PP') : 'End Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={applyFilters}
                >
                  Apply
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              </div>
            </div>

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
              initialJobId={urlJobId}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectsPage;
