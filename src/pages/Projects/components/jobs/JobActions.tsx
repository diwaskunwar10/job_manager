import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileText, Plus } from 'lucide-react';

interface JobActionsProps {
  job: {
    _id: string;
    name: string;
    status: string;
  };
  onReExecuteJob: (jobId: string) => void;
  onViewJobOutput: (jobId: string, jobName: string) => void;
  onAddFiles?: (jobId: string) => void;
}

const JobActions: React.FC<JobActionsProps> = ({
  job,
  onReExecuteJob,
  onViewJobOutput,
  onAddFiles
}) => {
  return (
    <div className="flex items-center justify-end space-x-2">
      {/* Re-execute button only for completed or failed jobs */}
      {(job.status.toLowerCase() === 'completed' || job.status.toLowerCase() === 'failed') && (
        <Button
          size="sm"
          variant="outline"
          className="flex items-center space-x-1"
          onClick={() => onReExecuteJob(job._id)}
        >
          <RefreshCw className="h-3 w-3" />
          <span>Re-execute</span>
        </Button>
      )}

      {/* Add Files button */}
      {onAddFiles && (
        <Button
          size="sm"
          variant="outline"
          className="flex items-center space-x-1"
          onClick={() => onAddFiles(job._id)}
        >
          <Plus className="h-3 w-3" />
          <span>Add Files</span>
        </Button>
      )}

      {/* View Output button - always visible */}
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
  );
};

export default JobActions;
