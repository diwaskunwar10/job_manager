import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { httpBase } from '@/utils/httpBase';
import { JOBS } from '@/constants/apiEndpoints';
import JobStatusBadge from './JobStatusBadge';
import AddMediaDialog from './AddMediaDialog';
import { CalendarIcon, Clock, User, FileText, Play, Upload, PlusCircle, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobDetailViewProps {
  jobId: string;
  onExecute?: () => void;
  onViewOutput?: (jobId: string, jobName: string) => void;
}

interface JobDetail {
  _id: string;
  name: string;
  description: string;
  status: string;
  process_name: string;
  created_at: string;
  executed_at?: string;
  completed_at?: string;
  created_by?: {
    _id: string;
    username: string;
  };
  project_id: string;
}

const JobDetailView: React.FC<JobDetailViewProps> = ({ jobId, onExecute, onViewOutput }) => {
  const [job, setJob] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isAddMediaDialogOpen, setIsAddMediaDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;

      setIsLoading(true);
      try {
        console.log('Fetching job details for ID:', jobId);

        // Use the jobService instead of direct httpBase call
        const response = await httpBase.get(JOBS.GET_JOB_BY_ID(jobId));
        console.log('Job details response:', response);

        // Handle different response formats
        let jobData = response;

        // If response is wrapped in a data property
        if (response && response.data && response.data._id) {
          jobData = response.data;
        }

        // Check if jobData is valid
        if (jobData && jobData._id) {
          setJob(jobData);
        } else {
          console.error('Invalid job response format:', response);
          toast({
            title: 'Error',
            description: 'Invalid job data received. Please try again.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load job details. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, toast]);

  const handleExecuteJob = async () => {
    if (!jobId) return;

    setIsExecuting(true);
    try {
      await httpBase.post(JOBS.EXECUTE_JOB(jobId));

      toast({
        title: 'Job Execution Started',
        description: 'The job has been queued for execution.',
      });

      // Refresh job details
      try {
        const updatedJob = await httpBase.get(JOBS.GET_JOB_BY_ID(jobId));
        console.log('Updated job after execution:', updatedJob);

        if (updatedJob && updatedJob._id) {
          setJob(updatedJob);
        } else {
          console.error('Invalid job data after execution:', updatedJob);
        }
      } catch (refreshError) {
        console.error('Error refreshing job details after execution:', refreshError);
      }

      if (onExecute) {
        onExecute();
      }
    } catch (error) {
      console.error('Error executing job:', error);
      toast({
        title: 'Error',
        description: 'Failed to execute job. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleMediaAdded = async () => {
    // Refresh job details after media is added
    try {
      console.log('Refreshing job details after media added for ID:', jobId);
      const updatedJob = await httpBase.get(JOBS.GET_JOB_BY_ID(jobId));
      console.log('Updated job after media added:', updatedJob);

      if (updatedJob && updatedJob._id) {
        setJob(updatedJob);

        toast({
          title: 'Media Added',
          description: 'Media has been successfully added to the job.',
        });
      } else {
        console.error('Invalid job data after media added:', updatedJob);
        toast({
          title: 'Warning',
          description: 'Media was added but job details could not be refreshed.',
          variant: 'warning',
        });
      }
    } catch (error) {
      console.error('Error refreshing job details after media added:', error);
      toast({
        title: 'Warning',
        description: 'Media was added but job details could not be refreshed.',
        variant: 'warning',
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!job) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center text-muted-foreground">
              Job details not found
            </div>
            <Button
              variant="outline"
              onClick={() => {
                // Try to fetch job details again
                const fetchJobDetails = async () => {
                  if (!jobId) return;

                  setIsLoading(true);
                  try {
                    const response = await httpBase.get(JOBS.GET_JOB_BY_ID(jobId));
                    if (response && response._id) {
                      setJob(response);
                      toast({
                        title: 'Success',
                        description: 'Job details loaded successfully.',
                      });
                    } else {
                      toast({
                        title: 'Error',
                        description: 'Could not load job details. Invalid data received.',
                        variant: 'destructive',
                      });
                    }
                  } catch (error) {
                    console.error('Error retrying job details fetch:', error);
                    toast({
                      title: 'Error',
                      description: 'Failed to load job details. Please try again.',
                      variant: 'destructive',
                    });
                  } finally {
                    setIsLoading(false);
                  }
                };

                fetchJobDetails();
              }}
            >
              Retry Loading Job Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const canExecute = job.status === 'pending' || job.status === 'failed';
  const formattedCreatedAt = job.created_at
    ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true })
    : 'Unknown';

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{job.name}</CardTitle>
          <JobStatusBadge status={job.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {job.description && (
          <div>
            <p className="text-sm text-muted-foreground">{job.description}</p>
          </div>
        )}

        <Separator />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground mr-2">Process:</span>
            <span>{job.process_name}</span>
          </div>

          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground mr-2">Created:</span>
            <span>{formattedCreatedAt}</span>
          </div>

          {job.created_by && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-2">Created by:</span>
              <span>{job.created_by.username}</span>
            </div>
          )}

          {job.executed_at && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-2">Executed:</span>
              <span>{formatDistanceToNow(new Date(job.executed_at), { addSuffix: true })}</span>
            </div>
          )}
        </div>

        <div className="pt-2 space-y-2">
          {canExecute && (
            <Button
              onClick={handleExecuteJob}
              disabled={isExecuting}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {isExecuting ? 'Executing...' : 'Execute Job'}
            </Button>
          )}

          <Button
            onClick={() => setIsAddMediaDialogOpen(true)}
            variant="outline"
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Add Files
          </Button>

          {onViewOutput && (
            <Button
              onClick={() => onViewOutput(jobId, job.name)}
              variant="outline"
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Output
            </Button>
          )}
        </div>

        <AddMediaDialog
          isOpen={isAddMediaDialogOpen}
          onOpenChange={setIsAddMediaDialogOpen}
          jobId={jobId}
          onMediaAdded={handleMediaAdded}
        />
      </CardContent>
    </Card>
  );
};

export default JobDetailView;
