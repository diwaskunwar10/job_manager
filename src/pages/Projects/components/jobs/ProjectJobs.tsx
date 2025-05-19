/**
 * Project Jobs Component
 *
 * Displays and manages jobs for a project, including filtering, pagination,
 * and job actions like execution and viewing output.
 */

import React, { useState, useEffect } from 'react';
import { projectService } from '@/services/projectService';
import { JobsFilter as JobsFilterType } from '../../hooks/useProjectJobs';
import { useToast } from '@/hooks/use-toast';
import { Job } from '../../types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { saveNavigationState } from '@/redux/slices/projectJobsNavigationSlice';

// Import job components
import JobsFilter from './job-components/JobsFilter';
import JobsContent from './job-components/JobsContent';
import JobsPagination from './job-components/JobsPagination';
import JobOutputDialog from './job-components/JobOutputDialog';
import JobDetailView from './JobDetailView';

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
  projectId?: string;
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
  const dispatch = useAppDispatch();
  const savedNavigation = useAppSelector(state => state.projectJobsNavigation);

  // State for job selection and output dialog
  const [isOutputDialogOpen, setIsOutputDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    savedNavigation.projectId === projectId ? savedNavigation.selectedJobId || null : null
  );
  const [selectedJobName, setSelectedJobName] = useState<string>('');
  const [jobOutput, setJobOutput] = useState<string>('');
  const [jobInput, setJobInput] = useState<string>('');
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [currentJobIndex, setCurrentJobIndex] = useState<number>(0);
  const [isLoadingOutput, setIsLoadingOutput] = useState(false);

  // Initialize job name from saved job ID when jobs are loaded
  useEffect(() => {
    if (selectedJobId && jobs.length > 0) {
      const job = jobs.find(job => job._id === selectedJobId);
      if (job) {
        setSelectedJobName(job.name);
        console.log('Found selected job in jobs array:', job.name);
      } else {
        console.warn('Selected job ID not found in jobs array:', selectedJobId);
      }
    }
  }, [jobs, selectedJobId]);

  // When jobs are loaded, check if we have a selectedJobId from Redux
  // This ensures that when navigating back from job output, the job is still selected
  useEffect(() => {
    if (jobs.length > 0 && savedNavigation.selectedJobId && !selectedJobId) {
      console.log('Setting selected job from Redux:', savedNavigation.selectedJobId);
      setSelectedJobId(savedNavigation.selectedJobId);

      // Find the job to get its name
      const job = jobs.find(job => job._id === savedNavigation.selectedJobId);
      if (job) {
        setSelectedJobName(job.name);

        // Scroll the job into view if needed
        // We need to wait for the DOM to update
        setTimeout(() => {
          const jobElement = document.getElementById(`job-row-${savedNavigation.selectedJobId}`);
          if (jobElement) {
            jobElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [jobs, savedNavigation.selectedJobId, selectedJobId]);

  // Handle execute job
  const handleExecuteJob = (jobId: string) => {
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

  // Handle job selection
  const handleJobSelect = (jobId: string) => {
    console.log('Job selected:', jobId);
    setSelectedJobId(jobId);
    // Save selected job ID to Redux by updating the navigation state
    dispatch(saveNavigationState({
      ...savedNavigation,
      selectedJobId: jobId
    }));

    const selectedJob = jobs.find(job => job._id === jobId);
    if (selectedJob) {
      console.log('Selected job found:', selectedJob);
      setSelectedJobName(selectedJob.name);
    } else {
      console.error('Selected job not found in jobs array');
    }
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

  // Note: The handleViewJobs function was removed as it's not currently used

  // Fetch job output
  const fetchJobOutput = (jobId: string) => {
    setIsLoadingOutput(true);

    projectService.getJobOutput(jobId, false)
      .then((response) => {
        console.log('Job output response:', response);
        // Handle Aroma Backend v2 response format
        if (response) {
          // If response has items array (Aroma Backend v2)
          if (response.items && Array.isArray(response.items)) {
            // Extract output items
            const outputItems = response.items.filter((item: any) => item.type === 'output');
            const outputText = outputItems.map((item: any) => item.content).join('\n');
            setJobOutput(outputText || 'No output available');

            // Extract input items
            const inputItems = response.items.filter((item: any) => item.type === 'input');
            const inputText = inputItems.length > 0 ? inputItems[0].content : '';
            setJobInput(inputText);
          }
          // Backward compatibility with old format
          else if (response.output) {
            setJobOutput(response.output || 'No output available');
            setJobInput(response.input || '');
          }
          // Handle data property (if API returns { data: ... })
          else if (response.data) {
            setJobOutput(response.data.output || 'No output available');
            setJobInput(response.data.input || '');
          }
          else {
            setJobOutput('No output available');
            setJobInput('');
          }
        } else {
          setJobOutput('No output available');
          setJobInput('');
        }
        setTotalJobs(response?.total_jobs || 0);
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
      <JobsFilter
        filter={filter}
        onFilterChange={onFilterChange}
      />

      {/* Main content area with proper scrolling - split into two columns */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left column - Jobs list */}
        <div className="w-1/2 overflow-auto border-r">
          <JobsContent
            jobs={jobs}
            isLoading={isLoading}
            selectedJobId={selectedJobId}
            onExecuteJob={handleExecuteJob}
            onReExecuteJob={handleReExecuteJob}
            onViewJobOutput={handleViewJobOutput}
            onJobSelect={handleJobSelect}
          />
        </div>

        {/* Right column - Job details */}
        <div className="w-1/2 overflow-auto p-4">
          {selectedJobId ? (
            <>
              {/* Debug info - will be removed in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <p><strong>Debug Info:</strong></p>
                  <p>Selected Job ID: {selectedJobId}</p>
                  <p>Selected Job Name: {selectedJobName}</p>
                </div>
              )}

              <JobDetailView
                jobId={selectedJobId}
                onExecute={() => {
                  // Refresh jobs list after execution
                  if (projectId) {
                    console.log('Refreshing jobs after execution');
                    projectService.getJobsByProject(projectId, filter)
                      .then((response) => {
                        console.log('Jobs refreshed successfully:', response);
                        toast({
                          title: "Jobs Refreshed",
                          description: "The jobs list has been refreshed."
                        });
                      })
                      .catch(error => {
                        console.error("Error refreshing jobs:", error);
                      });
                  }
                }}
                onViewOutput={handleViewJobOutput}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a job to view details</p>
            </div>
          )}
        </div>
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
