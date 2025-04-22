/**
 * Jobs Table Component
 *
 * Displays a table of jobs with columns for name, created date, status,
 * verification status, and actions.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Job } from '../../../types';
import JobActions from './JobActions';

interface JobsTableProps {
  jobs: Job[];
  selectedJobId?: string | null;
  onExecuteJob: (jobId: string) => void;
  onReExecuteJob: (jobId: string) => void;
  onViewJobOutput: (jobId: string, jobName: string) => void;
  onJobSelect?: (jobId: string) => void;
}

const JobsTable: React.FC<JobsTableProps> = ({
  jobs,
  selectedJobId,
  onExecuteJob,
  onReExecuteJob,
  onViewJobOutput,
  onJobSelect
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
    <div className="min-w-full overflow-hidden">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50/80 sticky top-0 z-10">
          <tr>
            <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Created At
            </th>
            <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Verified
            </th>
            <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {jobs?.map((job) => (
            <tr
              key={job._id}
              className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${selectedJobId === job._id ? 'bg-blue-50' : ''}`}
              onClick={() => onJobSelect && onJobSelect(job._id)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{job.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600">{formatDate(job.created_at)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderStatusBadge(job.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600">
                  {job.verified === true ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 font-medium">
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
