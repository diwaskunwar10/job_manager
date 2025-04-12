
import React, { useState } from 'react';
import JobFilterPanel from './JobFilterPanel';
import JobList from './JobList';
import JobPagination from './JobPagination';

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
      <JobFilterPanel
        statusFilter={statusFilter}
        projectFilter={projectFilter}
        createdAtStart={createdAtStart}
        createdAtEnd={createdAtEnd}
        executedAtStart={executedAtStart}
        executedAtEnd={executedAtEnd}
        onStatusFilterChange={handleStatusFilterChange}
        onProjectFilterChange={handleProjectFilterChange}
        onCreatedAtStartChange={handleCreatedAtStartChange}
        onCreatedAtEndChange={handleCreatedAtEndChange}
        onExecutedAtStartChange={handleExecutedAtStartChange}
        onExecutedAtEndChange={handleExecutedAtEndChange}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />

      {/* Job List */}
      <div className="flex-grow overflow-y-auto">
        <JobList 
          jobs={jobs}
          isLoading={isLoading}
          selectedJobId={selectedJobId}
          onJobSelect={onJobSelect}
        />
      </div>

      {/* Pagination */}
      <JobPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default JobListComponent;
