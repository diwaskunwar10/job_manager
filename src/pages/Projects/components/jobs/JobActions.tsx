import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, RefreshCw, FileText, Loader2 } from 'lucide-react';
import { Job } from '@/services/projectService';

interface JobActionsProps {
  job: Job;
  onExecuteJob: (jobId: string) => void;
  onReExecuteJob: (jobId: string) => void;
  onViewJobOutput: (jobId: string, jobName: string) => void;
}

const JobActions: React.FC<JobActionsProps> = ({
  job,
  onExecuteJob,
  onReExecuteJob,
  onViewJobOutput
}) => {
  return (
    <div className="flex space-x-2">
      {job.status.toLowerCase() === 'pending' && (
        <Button
          size="sm"
          variant="outline"
          className="flex items-center space-x-1"
          onClick={() => onExecuteJob(job._id)}
        >
          <Play className="h-3 w-3" />
          <span>Execute</span>
        </Button>
      )}
      {job.status.toLowerCase() === 'in-progress' && (
        <Button
          size="sm"
          variant="outline"
          className="flex items-center space-x-1"
          disabled
        >
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Running</span>
        </Button>
      )}
      {(job.status.toLowerCase() === 'completed' || job.status.toLowerCase() === 'failed') && (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center space-x-1"
            onClick={() => onReExecuteJob(job._id)}
          >
            <RefreshCw className="h-3 w-3" />
            <span>Re-execute</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center space-x-1"
            onClick={() => onViewJobOutput(job._id, job.name)}
          >
            <FileText className="h-3 w-3" />
            <span>View Output</span>
          </Button>
        </div>
      )}

      {/* View Output button for all other job statuses */}
      {!['completed', 'failed'].includes(job.status.toLowerCase()) && (
        <Button
          size="sm"
          variant="outline"
          className="flex items-center space-x-1"
          onClick={() => onViewJobOutput(job._id, job.name)}
        >
          <FileText className="h-3 w-3" />
          <span>View Output</span>
        </Button>
      )}
    </div>
  );
};

export default JobActions;
