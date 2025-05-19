import React, { useState } from 'react';
import { projectService } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { Job, JobsFilter as JobsFilterType } from '../types';

// Import refined components from jobs folder
import JobsFilterComponent from './jobs/JobsFilter';
import JobsContent from './jobs/JobsContent';
import JobsPagination from './jobs/JobsPagination';
import JobOutputDialog from './jobs/JobOutputDialog';

interface ProjectJobsProps {
  jobs: Job[];
  isLoading: boolean;
  filter: JobsFilterType;
  meta: {
    total: number;
    page: number;
    page_size: number;
    projectId?: string;
  };
  onFilterChange: (filter: Partial<JobsFilterType>) => void;
  pageSizeOptions?: number[];
  projectId?: string; // Add projectId prop
  onViewJobOutput?: (jobId: string, jobName: string) => void;
}

const ProjectJobs: React.FC<ProjectJobsProps> = ({
  jobs,
  isLoading,
  filter,
  meta,
  onFilterChange,
  pageSizeOptions = [5, 10, 20, 50],
  projectId,
  onViewJobOutput
}) => {
  const { toast } = useToast();

  // State for job output dialog
  const [isOutputDialogOpen, setIsOutputDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobName, setSelectedJobName] = useState<string>('');
  const [jobOutput, setJobOutput] = useState<string>('');
  const [jobInput, setJobInput] = useState<string>('');
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [currentJobIndex, setCurrentJobIndex] = useState<number>(0);
  const [isLoadingOutput, setIsLoadingOutput] = useState(false);

  // State for job management
  // Handle execute job
  const handleExecuteJob = (jobId: string) => {
    console.log(`Executing job: ${jobId}`);
    // Implement job execution API call
    projectService.executeJob(jobId)
      .then(() => {
        toast({
          title: "Job Execution Started",
          description: "The job has been queued for execution."
        });
      })
      .catch(error => {
        console.error("Error executing job:", error);
        toast({
          title: "Error Executing Job",
          description: "Failed to execute the job. Please try again.",
          variant: "destructive"
        });
      });
  };

  // Handle re-execute job
  const handleReExecuteJob = (jobId: string) => {
    console.log(`Re-executing job: ${jobId}`);
    // Implement job re-execution API call
    projectService.reExecuteJob(jobId)
      .then(() => {
        toast({
          title: "Job Re-Execution Started",
          description: "The job has been queued for re-execution."
        });
      })
      .catch(error => {
        console.error("Error re-executing job:", error);
        toast({
          title: "Error Re-Executing Job",
          description: "Failed to re-execute the job. Please try again.",
          variant: "destructive"
        });
      });
  };

  // Handle view job output
  const handleViewJobOutput = (jobId: string, jobName: string) => {
    if (onViewJobOutput) {
      // Use the parent component's handler if provided
      onViewJobOutput(jobId, jobName);
    } else {
      // Fallback to dialog if no handler provided
      setSelectedJobId(jobId);
      setSelectedJobName(jobName);
      setIsLoadingOutput(true);
      setJobOutput('');
      setJobInput('');
      setCurrentJobIndex(0);
      setIsOutputDialogOpen(true);

      fetchJobOutput(jobId);
    }
  };

  // Fetch job output
  const fetchJobOutput = (jobId: string) => {
    setIsLoadingOutput(true);

    projectService.getJobOutput(jobId, false)
      .then((response) => {
        console.log('Job output response:', response);
        if (response.data) {
          setJobOutput(response.data.output || 'No output available');
          setJobInput(response.data.input || '');
        } else {
          setJobOutput('No output available');
          setJobInput('');
        }
        setTotalJobs(response.total_jobs || 0);
      })
      .catch(error => {
        console.error("Error fetching job output:", error);
        setJobOutput('Failed to fetch job output. Please try again.');
        setJobInput('');
        setTotalJobs(0);
        toast({
          title: "Error Fetching Job Output",
          description: "Failed to fetch job output. Please try again.",
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsLoadingOutput(false);
      });
  };
  // Handle navigation to previous job output
  const handlePreviousJob = () => {
    if (selectedJobId && currentJobIndex > 0) {
      setCurrentJobIndex(currentJobIndex - 1);
      fetchJobOutput(selectedJobId);
    }
  };

  // Handle navigation to next job output
  const handleNextJob = () => {
    if (selectedJobId && currentJobIndex < totalJobs - 1) {
      setCurrentJobIndex(currentJobIndex + 1);
      fetchJobOutput(selectedJobId);
    }
  };

  // Check if projectId is available
  if (!projectId && !meta.projectId) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p>No project selected. Please select a project to view jobs.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <JobsFilterComponent
        filter={filter}
        onFilterChange={onFilterChange}
      />

      {/* Main content area with proper scrolling */}
      <div className="flex-1 overflow-auto">
        <JobsContent
          jobs={jobs}
          isLoading={isLoading}
          onExecuteJob={handleExecuteJob}
          onReExecuteJob={handleReExecuteJob}
          onViewJobOutput={handleViewJobOutput}
        />
      </div>

      {/* Fixed pagination footer */}
      <div className="p-4 border-t bg-white flex-shrink-0">
        <JobsPagination
          filter={filter}
          meta={meta}
          isLoading={isLoading}
          onFilterChange={onFilterChange}
          pageSizeOptions={pageSizeOptions}
        />
      </div>

      {/* Job Output Dialog */}
      <JobOutputDialog
        isOpen={isOutputDialogOpen}
        onOpenChange={setIsOutputDialogOpen}
        jobId={selectedJobId}
        jobName={selectedJobName}
        jobOutput={jobOutput}
        jobInput={jobInput}
        totalJobs={totalJobs}
        currentJobIndex={currentJobIndex}
        isLoading={isLoadingOutput}
        onPreviousJob={handlePreviousJob}
        onNextJob={handleNextJob}
      />
    </div>
  );
};

export default ProjectJobs;