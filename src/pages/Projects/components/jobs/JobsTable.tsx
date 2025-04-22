import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Job } from '@/services/projectService';
import JobActions from './JobActions';

interface JobsTableProps {
  jobs: Job[];
  onExecuteJob: (jobId: string) => void;
  onReExecuteJob: (jobId: string) => void;
  onViewJobOutput: (jobId: string, jobName: string) => void;
}

const JobsTable: React.FC<JobsTableProps> = ({
  jobs,
  onExecuteJob,
  onReExecuteJob,
  onViewJobOutput
}) => {
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
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

  return (
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
                  {job.verified === true ? (
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
                <JobActions 
                  job={job}
                  onExecuteJob={onExecuteJob}
                  onReExecuteJob={onReExecuteJob}
                  onViewJobOutput={onViewJobOutput}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobsTable;
