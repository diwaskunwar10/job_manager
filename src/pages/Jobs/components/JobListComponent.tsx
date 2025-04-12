import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../components/ui/collapsible';

// Define Job type locally to avoid import issues
interface Job {
  _id: string;
  id: string; // Required for backward compatibility
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  project_id: string;
  project_name: string;
  created_at: string;
  executed_at?: string;
  completed_at?: string;
}

interface JobListComponentProps {
  jobs: Job[];
  isLoading: boolean;
  onJobSelect: (jobId: string) => void;
  selectedJobId: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
}

const JobListComponent: React.FC<JobListComponentProps> = ({
  jobs,
  isLoading,
  onJobSelect,
  selectedJobId,
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onFilterChange
}) => {
  // Filter states aligned with API parameters
  const [projectId, setProjectId] = useState<string>('');
  const [verified, setVerified] = useState<string>('all'); // 'all', 'true', 'false'
  const [createdAtStart, setCreatedAtStart] = useState<string>('');
  const [createdAtEnd, setCreatedAtEnd] = useState<string>('');
  const [executedAtStart, setExecutedAtStart] = useState<string>('');
  const [executedAtEnd, setExecutedAtEnd] = useState<string>('');

  // Search and filter UI states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchActive, setSearchActive] = useState<boolean>(false);

  // Animated placeholder states
  const [placeholder, setPlaceholder] = useState('');
  const fullPlaceholder = "Search jobs...";
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Handle filter changes
  const handleVerifiedFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVerified(e.target.value);
    // We'll apply filters after a short delay to avoid multiple API calls
    setTimeout(() => applyFilters(), 100);
  };

  const handleProjectFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProjectId(e.target.value);
    setTimeout(() => applyFilters(), 100);
  };

  const handleCreatedAtStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreatedAtStart(e.target.value);
    setTimeout(() => applyFilters(), 100);
  };

  const handleCreatedAtEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreatedAtEnd(e.target.value);
    setTimeout(() => applyFilters(), 100);
  };

  const handleExecutedAtStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExecutedAtStart(e.target.value);
    setTimeout(() => applyFilters(), 100);
  };

  const handleExecutedAtEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExecutedAtEnd(e.target.value);
    setTimeout(() => applyFilters(), 100);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchActive(value.length > 0);
  };

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
  }, [placeholderIndex, fullPlaceholder]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Reset animation after it completes
  useEffect(() => {
    if (placeholderIndex > fullPlaceholder.length) {
      const resetTimeout = setTimeout(() => {
        setPlaceholderIndex(0);
      }, 2000);
      return () => clearTimeout(resetTimeout);
    }
  }, [placeholderIndex, fullPlaceholder]);

  // Store previous filter values to detect changes
  const prevFilters = useRef({
    searchQuery: '',
    verified: 'all',
    projectId: '',
    createdAtStart: '',
    createdAtEnd: '',
    executedAtStart: '',
    executedAtEnd: ''
  });

  // Apply filters only when user explicitly changes them
  const applyFilters = useCallback(() => {
    // Check if any filter has changed
    const hasChanged =
      searchQuery !== prevFilters.current.searchQuery ||
      verified !== prevFilters.current.verified ||
      projectId !== prevFilters.current.projectId ||
      createdAtStart !== prevFilters.current.createdAtStart ||
      createdAtEnd !== prevFilters.current.createdAtEnd ||
      executedAtStart !== prevFilters.current.executedAtStart ||
      executedAtEnd !== prevFilters.current.executedAtEnd;

    if (!hasChanged) {
      console.log('No filter changes detected, skipping filter application');
      return;
    }

    // Update previous filter values
    prevFilters.current = {
      searchQuery,
      verified,
      projectId,
      createdAtStart,
      createdAtEnd,
      executedAtStart,
      executedAtEnd
    };

    // Prepare filter parameters aligned with API
    const filters: Record<string, any> = {};

    if (searchQuery) filters.search_query = searchQuery;
    if (projectId) filters.project_id = projectId;
    if (verified !== 'all') filters.verified = verified === 'true';
    if (createdAtStart) filters.created_at_start = createdAtStart;
    if (createdAtEnd) filters.created_at_end = createdAtEnd;
    if (executedAtStart) filters.executed_at_start = executedAtStart;
    if (executedAtEnd) filters.executed_at_end = executedAtEnd;

    console.log('Applying filters:', filters);

    // Call the parent component's filter change handler if provided
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [searchQuery, verified, projectId, createdAtStart, createdAtEnd, executedAtStart, executedAtEnd, onFilterChange]);

  // Debounce search input to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        applyFilters();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, applyFilters]);

  // Reset filters
  const resetFilters = () => {
    setVerified('all');
    setProjectId('');
    setCreatedAtStart('');
    setCreatedAtEnd('');
    setExecutedAtStart('');
    setExecutedAtEnd('');
    setSearchQuery('');

    // Apply the reset filters
    setTimeout(() => applyFilters(), 100);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Search */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Jobs</h2>
        </div>

        {/* Search Bar with Animation */}
        <div className="relative">
          <div className={`relative transition-all duration-300 ease-in-out transform ${searchFocused ? 'scale-105 -translate-y-0.5' : 'scale-100'}`}>
            <input
              type="text"
              placeholder={`${placeholder}${showCursor && placeholderIndex <= fullPlaceholder.length ? '|' : ''}`}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                setSearchFocused(true);
                // Stop the placeholder animation when focused
                setPlaceholderIndex(fullPlaceholder.length + 1);
              }}
              onBlur={() => setSearchFocused(false)}
              className={`pl-10 pr-4 py-2 w-full rounded-md border ${searchFocused ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-200' : 'border-gray-300 shadow-sm'} outline-none transition-all duration-300`}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                className={`h-5 w-5 transition-all duration-300 ${searchFocused ? 'text-indigo-500 scale-110' : searchActive ? 'text-gray-500' : 'text-gray-400 animate-pulse-slow'}`}
                style={{
                  transform: searchFocused ? 'translateX(-2px) rotate(-5deg)' : 'translateX(0) rotate(0deg)',
                  transition: 'transform 0.3s ease-in-out'
                }}
              />
            </div>
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Filters */}
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="border-b">
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
          <div className="flex items-center">
            <span className={`mr-2 transition-colors duration-300 ${isFilterOpen ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}>Filters</span>
            <div className={`px-2 py-1 text-xs rounded-full transition-colors duration-300 ${isFilterOpen ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>
              {verified !== 'all' || projectId !== '' || createdAtStart !== '' || createdAtEnd !== '' || executedAtStart !== '' || executedAtEnd !== '' || searchQuery !== '' ? 'Active' : 'None'}
            </div>
          </div>
          <div className="flex items-center">
            {isFilterOpen ?
              <ChevronUp className="h-4 w-4 text-indigo-500 transition-transform duration-300 transform" /> :
              <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-300 transform" />}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="p-4 space-y-3 overflow-hidden transition-all duration-300 animate-accordion-down">
          {/* Verified Filter */}
          <div>
            <label className="block text-sm text-gray-700">Verification Status</label>
            <select
              value={verified}
              onChange={handleVerifiedFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm transition-all duration-200 hover:border-gray-400"
            >
              <option value="all">All</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <label className="block text-sm text-gray-700">Project</label>
            <select
              value={projectId}
              onChange={handleProjectFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm transition-all duration-200 hover:border-gray-400"
            >
              <option value="">All Projects</option>
              {/* Project options would be dynamically populated */}
              <option value="project1">Project 1</option>
              <option value="project2">Project 2</option>
            </select>
          </div>

          {/* Created At Filter */}
          <div>
            <label className="block text-sm text-gray-700">Created At</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={createdAtStart}
                onChange={handleCreatedAtStartChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm transition-all duration-200 hover:border-gray-400"
                placeholder="From"
              />
              <input
                type="date"
                value={createdAtEnd}
                onChange={handleCreatedAtEndChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm transition-all duration-200 hover:border-gray-400"
                placeholder="To"
              />
            </div>
          </div>

          {/* Executed At Filter */}
          <div>
            <label className="block text-sm text-gray-700">Executed At</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={executedAtStart}
                onChange={handleExecutedAtStartChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm transition-all duration-200 hover:border-gray-400"
                placeholder="From"
              />
              <input
                type="date"
                value={executedAtEnd}
                onChange={handleExecutedAtEndChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm transition-all duration-200 hover:border-gray-400"
                placeholder="To"
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
            >
              Reset Filters
            </button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Job List */}
      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No jobs found
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <li
                key={job._id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedJobId === job._id ? 'bg-indigo-50' : ''
                }`}
                onClick={() => onJobSelect(job._id)}
              >
                <div className="flex justify-between">
                  <div className="font-medium">{job.name}</div>
                  <div className={`text-sm ${
                    job.status === 'completed' ? 'text-green-600' :
                    job.status === 'failed' ? 'text-red-600' :
                    job.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {job.status}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Project: {job.project_name}
                </div>
                <div className="text-xs text-gray-400">
                  Created: {new Date(job.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <select
              className="ml-2 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              defaultValue={10}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListComponent;