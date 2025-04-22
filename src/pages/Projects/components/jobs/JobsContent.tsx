import React from 'react';
import { Job } from '@/services/projectService';
import { Loader2 } from 'lucide-react';
import JobsTable from './JobsTable';

interface JobsContentProps {
  jobs: Job[];
  isLoading: boolean;
  onExecuteJob: (jobId: string) => void;
  onReExecuteJob: (jobId: string) => void;
  onViewJobOutput: (jobId: string, jobName: string) => void;
}

const JobsContent: React.FC<JobsContentProps> = ({
  jobs,
  isLoading,
  onExecuteJob,
  onReExecuteJob,
  onViewJobOutput
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
      onExecuteJob={onExecuteJob}
      onReExecuteJob={onReExecuteJob}
      onViewJobOutput={onViewJobOutput}
    />
  );
};

export default JobsContent;
