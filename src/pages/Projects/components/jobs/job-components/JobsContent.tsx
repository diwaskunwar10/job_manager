/**
 * Jobs Content Component
 *
 * Displays the content of the jobs tab, including a table of jobs or loading/empty states.
 */

import React from 'react';
import { Job } from '../../../types';
import { Loader2 } from 'lucide-react';
import JobsTable from './JobsTable';

interface JobsContentProps {
  jobs: Job[];
  isLoading: boolean;
  selectedJobId?: string | null;
  onExecuteJob: (jobId: string) => void;
  onReExecuteJob: (jobId: string) => void;
  onViewJobOutput: (jobId: string, jobName: string) => void;
  onJobSelect?: (jobId: string) => void;
}

const JobsContent: React.FC<JobsContentProps> = ({
  jobs,
  isLoading,
  selectedJobId,
  onExecuteJob,
  onReExecuteJob,
  onViewJobOutput,
  onJobSelect
}) => {
  // Safely check if jobs is an array
  const hasJobs = Array.isArray(jobs) && jobs.length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mr-2" />
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (!hasJobs) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No jobs found</p>
      </div>
    );
  }

  return (
    <JobsTable
      jobs={jobs}
      selectedJobId={selectedJobId}
      onExecuteJob={onExecuteJob}
      onReExecuteJob={onReExecuteJob}
      onViewJobOutput={onViewJobOutput}
      onJobSelect={onJobSelect}
    />
  );
};

export default JobsContent;
