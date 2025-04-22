import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface JobOutputDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string | null;
  jobName: string;
  jobOutput: string;
  jobInput: string;
  totalJobs: number;
  currentJobIndex: number;
  isLoading: boolean;
  onPreviousJob: () => void;
  onNextJob: () => void;
}

const JobOutputDialog: React.FC<JobOutputDialogProps> = ({
  isOpen,
  onOpenChange,
  jobId,
  jobName,
  jobOutput,
  jobInput,
  totalJobs,
  currentJobIndex,
  isLoading,
  onPreviousJob,
  onNextJob
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Job Output: {jobName}</DialogTitle>
          <DialogDescription>
            <div className="flex justify-between items-center">
              <div>Job ID: {jobId}</div>
              {totalJobs > 1 && (
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentJobIndex <= 0 || isLoading}
                    onClick={onPreviousJob}
                  >
                    Previous
                  </Button>
                  <span className="text-xs">
                    {currentJobIndex + 1} of {totalJobs}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentJobIndex >= totalJobs - 1 || isLoading}
                    onClick={onNextJob}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        {jobInput && (
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-1">Input:</h4>
            <div className="p-2 bg-gray-50 rounded border text-sm">
              {jobInput.endsWith('.jpg') || jobInput.endsWith('.png') || jobInput.endsWith('.jpeg') || jobInput.endsWith('.gif') ? (
                <div className="flex justify-center">
                  <img
                    src={jobInput}
                    alt="Input image"
                    className="max-h-40 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                    }}
                  />
                </div>
              ) : (
                <div className="text-sm">{jobInput}</div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto mt-4 mb-4 p-4 bg-gray-100 rounded-md">
          <h4 className="text-sm font-medium mb-1">Output:</h4>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Loading job output...</span>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-sm">{jobOutput}</pre>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobOutputDialog;
