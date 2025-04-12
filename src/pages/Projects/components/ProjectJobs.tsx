import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Job, projectService } from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { JobsFilter } from '../hooks/useProjectJobs';
import { format } from 'date-fns';
import { Loader2, Play, RefreshCw, ChevronsLeft, ChevronsRight, FileText, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ProjectJobsProps {
  jobs: Job[];
  isLoading: boolean;
  filter: JobsFilter;
  meta: {
    total: number;
    page: number;
    page_size: number;
    projectId?: string;
  };
  onFilterChange: (filter: Partial<JobsFilter>) => void;
  pageSizeOptions?: number[];
  projectId?: string; // Add projectId prop
}

const ProjectJobs: React.FC<ProjectJobsProps> = ({
  jobs,
  isLoading,
  filter,
  meta,
  onFilterChange,
  pageSizeOptions = [5, 10, 20, 50],
  projectId
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
  const handleViewJobOutput = (jobId: string, jobName: string, jobIndex: number = 0) => {
    setSelectedJobId(jobId);
    setSelectedJobName(jobName);
    setIsLoadingOutput(true);
    setJobOutput('');
    setJobInput('');
    setCurrentJobIndex(jobIndex);
    setIsOutputDialogOpen(true);

    fetchJobOutput(jobId, jobIndex);
  };

  // Fetch job output with specific index
  const fetchJobOutput = (jobId: string, jobIndex: number = 0) => {
    setIsLoadingOutput(true);

    projectService.getJobOutput(jobId, jobIndex)
      .then((response) => {
        console.log('Job output response:', response);
        if (response.data) {
          setJobOutput(response.data.putput || 'No output available');
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
  // Calculate total pages
  const totalPages = Math.ceil(meta.total / meta.page_size);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  // State for page input
  const [pageInputValue, setPageInputValue] = useState<string>('');

  // Handle direct page navigation
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPageInputValue(value);
  };

  // Handle page input submission
  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(pageInputValue, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages && !isLoading) {
      onFilterChange({ page: pageNumber });
      setPageInputValue('');
    }
  };

  // Generate pagination component
  const renderPagination = () => {
    // For smaller screens or when there are many pages, show fewer page numbers
    const maxVisiblePages = 3; // Adjust based on screen size if needed
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, filter.page - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="text-sm text-gray-500 mb-2 sm:mb-0">
          Page {filter.page} of {totalPages}
        </div>

        <Pagination>
          <PaginationContent>
            {/* First page button */}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={filter.page === 1 || isLoading}
                onClick={() => {
                  if (filter.page !== 1 && !isLoading) {
                    onFilterChange({ page: 1 });
                  }
                }}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
            </PaginationItem>

            {/* Previous button */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (filter.page > 1 && !isLoading) {
                    onFilterChange({ page: Math.max(1, filter.page - 1) });
                  }
                }}
                className={filter.page === 1 || isLoading ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {/* Page numbers */}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href="#"
                  isActive={pageNum === filter.page}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isLoading) {
                      onFilterChange({ page: pageNum });
                    }
                  }}
                  className={isLoading ? 'pointer-events-none' : ''}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Next button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (filter.page < totalPages && !isLoading) {
                    onFilterChange({ page: Math.min(totalPages, filter.page + 1) });
                  }
                }}
                className={filter.page === totalPages || isLoading ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {/* Last page button */}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={filter.page === totalPages || isLoading}
                onClick={() => {
                  if (filter.page !== totalPages && !isLoading) {
                    onFilterChange({ page: totalPages });
                  }
                }}
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Page input form */}
        <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2 ml-2">
          <div className="flex items-center">
            <Input
              type="text"
              value={pageInputValue}
              onChange={handlePageInputChange}
              placeholder="Go to page"
              className="w-20 h-8 text-sm"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="ml-1 h-8"
              disabled={isLoading || !pageInputValue}
            >
              Go
            </Button>
          </div>
        </form>
      </div>
    );
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    let variant = "default";

    switch (status.toLowerCase()) {
      case 'completed':
        variant = "success";
        break;
      case 'in-progress':
        variant = "info";
        break;
      case 'pending':
        variant = "warning";
        break;
      case 'failed':
        variant = "destructive";
        break;
    }

    return (
      <Badge variant={variant as any} className="capitalize">
        {status}
      </Badge>
    );
  };

  // Safely check if jobs is an array
  const hasJobs = Array.isArray(jobs) && jobs.length > 0;

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
      {/* Fixed header */}
      <div className="p-4 border-b flex-shrink-0">
        <h2 className="text-lg font-medium mb-4">Jobs</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div>
            <Select
              value={filter.jobStatus || "all"}
              onValueChange={(value) => onFilterChange({ jobStatus: value === "all" ? undefined : value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={filter.verified !== undefined ? String(filter.verified) : "all"}
              onValueChange={(value) => onFilterChange({ verified: value === "all" ? undefined : value === "true" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Verified" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Verified</SelectItem>
                <SelectItem value="false">Not Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <div className="flex gap-2">
              <Input
                placeholder="Search jobs..."
                value={filter.searchQuery || ""}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  onFilterChange({ searchQuery: value === "" ? undefined : value });
                }}
              />
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Resetting filters');
                  onFilterChange({
                    jobStatus: undefined, // Will be converted to "all" in the Select
                    verified: undefined,  // Will be converted to "all" in the Select
                    searchQuery: "",
                    page: 1
                  });
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area with proper scrolling */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading jobs...</p>
          </div>
        ) : !hasJobs ? (
          <div className="flex items-center justify-center h-full">
            <p>No jobs found</p>
          </div>
        ) : (
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs?.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(job.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(job.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {job.verified ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            Not Verified
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {job.status.toLowerCase() === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center space-x-1"
                            onClick={() => handleExecuteJob(job._id)}
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
                              onClick={() => handleReExecuteJob(job._id)}
                            >
                              <RefreshCw className="h-3 w-3" />
                              <span>Re-execute</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center space-x-1"
                              onClick={() => handleViewJobOutput(job._id, job.name)}
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
                            onClick={() => handleViewJobOutput(job._id, job.name)}
                          >
                            <FileText className="h-3 w-3" />
                            <span>View Output</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fixed pagination footer */}
      <div className="p-4 border-t bg-white flex-shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="text-sm text-gray-500">Show:</div>
            <Select
              value={String(filter.pageSize)}
              onValueChange={(value) => onFilterChange({ pageSize: Number(value) })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Page Size" />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={String(size)}>{size} per page</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-500 hidden md:block">
              Showing {Math.min((filter.page - 1) * filter.pageSize + 1, meta.total)} - {Math.min(filter.page * filter.pageSize, meta.total)} of {meta.total} items
            </div>
          </div>
          <div className="w-full md:w-auto">
            {renderPagination()}
          </div>
        </div>
      </div>

      {/* Job Output Dialog */}
      <Dialog open={isOutputDialogOpen} onOpenChange={setIsOutputDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Job Output: {selectedJobName}</DialogTitle>
            <DialogDescription>
              <div className="flex justify-between items-center">
                <div>Job ID: {selectedJobId}</div>
                {totalJobs > 1 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={currentJobIndex <= 0 || isLoadingOutput}
                      onClick={() => {
                        if (selectedJobId && currentJobIndex > 0) {
                          fetchJobOutput(selectedJobId, currentJobIndex - 1);
                        }
                      }}
                    >
                      Previous
                    </Button>
                    <span className="text-xs">
                      {currentJobIndex + 1} of {totalJobs}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={currentJobIndex >= totalJobs - 1 || isLoadingOutput}
                      onClick={() => {
                        if (selectedJobId && currentJobIndex < totalJobs - 1) {
                          fetchJobOutput(selectedJobId, currentJobIndex + 1);
                        }
                      }}
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
            {isLoadingOutput ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading job output...</span>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-sm">{jobOutput}</pre>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsOutputDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectJobs;