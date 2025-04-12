import React, { useState } from 'react';

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
}

const JobListComponent: React.FC<JobListComponentProps> = ({
  jobs,
  isLoading,
  onJobSelect,
  selectedJobId,
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange
}) => {
  // Filter states
  const [statusFilter, setStatusFilter] = useState<'assigned' | 'unassigned' | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('');
  const [createdAtStart, setCreatedAtStart] = useState<string>('');
  const [createdAtEnd, setCreatedAtEnd] = useState<string>('');
  const [executedAtStart, setExecutedAtStart] = useState<string>('');
  const [executedAtEnd, setExecutedAtEnd] = useState<string>('');

  // Handle filter changes
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as 'assigned' | 'unassigned' | 'all');
  };

  const handleProjectFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProjectFilter(e.target.value);
  };

  const handleCreatedAtStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreatedAtStart(e.target.value);
  };

  const handleCreatedAtEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreatedAtEnd(e.target.value);
  };

  const handleExecutedAtStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExecutedAtStart(e.target.value);
  };

  const handleExecutedAtEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExecutedAtEnd(e.target.value);
  };

  // Apply filters
  const applyFilters = () => {
    // This would trigger a refetch with the filter parameters
    console.log('Applying filters:', {
      status: statusFilter,
      project: projectFilter,
      createdAtRange: [createdAtStart, createdAtEnd],
      executedAtRange: [executedAtStart, executedAtEnd]
    });
  };

  // Reset filters
  const resetFilters = () => {
    setStatusFilter('all');
    setProjectFilter('');
    setCreatedAtStart('');
    setCreatedAtEnd('');
    setExecutedAtStart('');
    setExecutedAtEnd('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Jobs</h2>
      </div>

      {/* Filters */}
      <div className="p-4 border-b space-y-3">
        <h3 className="text-sm font-medium">Filters</h3>

        {/* Status Filter */}
        <div>
          <label className="block text-sm text-gray-700">Status</label>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>

        {/* Project Filter */}
        <div>
          <label className="block text-sm text-gray-700">Project</label>
          <select
            value={projectFilter}
            onChange={handleProjectFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="From"
            />
            <input
              type="date"
              value={createdAtEnd}
              onChange={handleCreatedAtEndChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="From"
            />
            <input
              type="date"
              value={executedAtEnd}
              onChange={handleExecutedAtEndChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="To"
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex space-x-2">
          <button
            onClick={applyFilters}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset
          </button>
        </div>
      </div>

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
