import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Pause,
  HelpCircle
} from 'lucide-react';

type JobStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'paused' | string;

interface JobStatusBadgeProps {
  status: JobStatus;
  className?: string;
}

const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({ status, className = '' }) => {
  // Normalize status to lowercase and handle hyphenated variants
  const normalizedStatus = status.toLowerCase().replace('-', '');
  
  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  let icon = <HelpCircle className="h-3.5 w-3.5 mr-1" />;
  let displayText = status;

  switch (normalizedStatus) {
    case 'pending':
      badgeVariant = 'outline';
      icon = <Clock className="h-3.5 w-3.5 mr-1" />;
      displayText = 'Pending';
      break;
    case 'inprogress':
      badgeVariant = 'default';
      icon = <Play className="h-3.5 w-3.5 mr-1" />;
      displayText = 'In Progress';
      break;
    case 'completed':
      badgeVariant = 'secondary';
      icon = <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      displayText = 'Completed';
      break;
    case 'failed':
      badgeVariant = 'destructive';
      icon = <AlertCircle className="h-3.5 w-3.5 mr-1" />;
      displayText = 'Failed';
      break;
    case 'paused':
      badgeVariant = 'outline';
      icon = <Pause className="h-3.5 w-3.5 mr-1" />;
      displayText = 'Paused';
      break;
    default:
      // Use defaults for unknown status
      break;
  }

  return (
    <Badge variant={badgeVariant} className={`flex items-center ${className}`}>
      {icon}
      <span>{displayText}</span>
    </Badge>
  );
};

export default JobStatusBadge;
