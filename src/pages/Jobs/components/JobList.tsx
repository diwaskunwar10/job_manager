
import React from 'react';
import JobListItem from './JobListItem';

interface Job {
  _id: string;
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  project_name: string;
  created_at: string;
}

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  selectedJobId: string | null;
  onJobSelect: (jobId: string) => void;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading,
  selectedJobId,
  onJobSelect
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        No jobs found
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {jobs.map((job) => (
        <JobListItem 
          key={job._id}
          job={job}
          isSelected={selectedJobId === job._id}
          onSelect={onJobSelect}
        />
      ))}
    </ul>
  );
};

export default JobList;
