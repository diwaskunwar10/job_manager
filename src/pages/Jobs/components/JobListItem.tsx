
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

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
  // Format the date in a more readable way
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  // Get appropriate status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" className="capitalize">{status}</Badge>;
      case 'in_progress':
        return <Badge variant="info" className="capitalize">{status.replace('_', ' ')}</Badge>;
      case 'pending':
        return <Badge variant="warning" className="capitalize">{status}</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="capitalize">{status}</Badge>;
      default:
        return <Badge variant="secondary" className="capitalize">{status}</Badge>;
    }
  };

  return (
    <li
      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-indigo-50' : ''
      }`}
      onClick={() => onSelect(job._id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{job.name}</div>
          <div className="text-sm text-gray-500 mt-1">
            Project: {job.project_name}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Created: {formatDate(job.created_at)}
          </div>
        </div>
        <div>
          {getStatusBadge(job.status)}
        </div>
      </div>
    </li>
  );
};

export default JobListItem;
