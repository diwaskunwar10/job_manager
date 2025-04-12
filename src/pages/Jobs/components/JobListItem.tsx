
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface Job {
  _id: string;
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  project_name: string;
  project_id: string;
  created_at: string;
}

interface JobListItemProps {
  job: Job;
  isSelected: boolean;
  onSelect: (jobId: string) => void;
}

const JobListItem: React.FC<JobListItemProps> = ({ job, isSelected, onSelect }) => {
  const { state } = useAppContext();
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
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

  // Handle view output click
  const handleViewOutput = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use either the route param projectId or the job's project_id
    const pid = projectId || job.project_id;
    navigate(`/${state.tenant?.slug}/projects/${pid}/jobs/${job._id}/output`);
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
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge(job.status)}
          
          <button 
            onClick={handleViewOutput}
            className="text-xs flex items-center text-blue-600 hover:text-blue-800 mt-1"
          >
            <ExternalLink className="h-3 w-3 mr-1" /> View Output
          </button>
        </div>
      </div>
    </li>
  );
};

export default JobListItem;
