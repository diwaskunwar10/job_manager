import React from 'react';
import { Job, projectService } from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { JobsFilter } from '../hooks/useProjectJobs';
import { format } from 'date-fns';
import { Loader2, Play, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectJobsProps {
  jobs: Job[];
  isLoading: boolean;
  filter: JobsFilter;
  meta: {
    total: number;
    page: number;
    page_size: number;
  };
  onFilterChange: (filter: Partial<JobsFilter>) => void;
}

const ProjectJobs: React.FC<ProjectJobsProps> = ({
  jobs,
  isLoading,
  filter,
  meta,
  onFilterChange
}) => {
  const { toast } = useToast();
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

  // Generate pagination buttons
  const renderPagination = () => {
    const buttons = [];

    // Previous button
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => onFilterChange({ page: Math.max(1, filter.page - 1) })}
        disabled={filter.page === 1 || isLoading}
        className="px-3"
      >
        &lt;
      </Button>
    );

    // Page numbers
    const startPage = Math.max(1, filter.page - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === filter.page ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange({ page: i })}
          disabled={isLoading}
          className="px-3"
        >
          {i}
        </Button>
      );
    }

    // Next button
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => onFilterChange({ page: Math.min(totalPages, filter.page + 1) })}
        disabled={filter.page === totalPages || isLoading}
        className="px-3"
      >
        &gt;
      </Button>
    );

    return buttons;
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

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
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

      <div className="flex-grow overflow-auto">
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
              <thead className="bg-gray-50">
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center space-x-1"
                            onClick={() => handleReExecuteJob(job._id)}
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Re-execute</span>
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

      {totalPages > 1 && (
        <div className="p-4 border-t flex justify-center space-x-1">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default ProjectJobs;
