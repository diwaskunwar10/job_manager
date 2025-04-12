
import React from 'react';

interface Job {
  _id: string;
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  project_name: string;
  created_at: string;
}

interface JobListItemProps {
  job: Job;
  isSelected: boolean;
  onSelect: (jobId: string) => void;
}

const JobListItem: React.FC<JobListItemProps> = ({ job, isSelected, onSelect }) => {
  return (
    <li
      className={`p-4 cursor-pointer hover:bg-gray-50 ${
        isSelected ? 'bg-indigo-50' : ''
      }`}
      onClick={() => onSelect(job._id)}
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
  );
};

export default JobListItem;
