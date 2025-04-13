
import React from 'react';
import { format } from 'date-fns';
import { Job } from '../../../types/job';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface JobListItemProps {
  job: Job;
  isSelected: boolean;
  onSelect: () => void;
  onViewOutput: () => void;
}

const JobListItem: React.FC<JobListItemProps> = ({ job, isSelected, onSelect, onViewOutput }) => {
  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default: // pending
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  // Format status for display
  const getFormattedStatus = (status: string) => {
    if (status === 'in_progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div 
      className={`p-4 cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">{job.name}</h3>
          
          <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
            <span>Project: {job.project_name || 'Unknown'}</span>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2 items-center">
            <span 
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeClass(job.status)}`}
            >
              {getFormattedStatus(job.status)}
            </span>
            
            {job.verified && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                Verified
              </span>
            )}
            
            <span className="text-xs text-gray-500">
              Created: {format(new Date(job.created_at), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onViewOutput();
          }}
        >
          <Eye className="h-3 w-3 mr-1" /> Output
        </Button>
      </div>
    </div>
  );
};

export default JobListItem;
