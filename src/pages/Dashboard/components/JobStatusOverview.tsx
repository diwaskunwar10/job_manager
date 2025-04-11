
import React from 'react';

interface JobStatusOverviewProps {
  jobsData: {
    verified: { count: number };
    status: { completed: number; inProgress: number; pending: number };
    unassigned: { count: number };
  };
  isLoading?: boolean;
}

const JobStatusOverview: React.FC<JobStatusOverviewProps> = ({ jobsData, isLoading = false }) => {
  const totalJobs = jobsData.status.completed + jobsData.status.inProgress + jobsData.status.pending || 1; // Prevent division by zero

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-medium text-gray-900">Job Status Overview</h2>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading job data...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Verified Jobs</p>
            <p className="text-2xl font-bold">{jobsData.verified.count}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Job Status</p>
            <div className="mt-2 space-y-2">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Completed</span>
                  <span className="font-medium">{jobsData.status.completed}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(jobsData.status.completed / totalJobs) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>In Progress</span>
                  <span className="font-medium">{jobsData.status.inProgress}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${(jobsData.status.inProgress / totalJobs) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Pending</span>
                  <span className="font-medium">{jobsData.status.pending}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(jobsData.status.pending / totalJobs) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Unassigned Jobs</p>
            <p className="text-2xl font-bold">{jobsData.unassigned.count}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobStatusOverview;
