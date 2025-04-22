import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { 
  getJobsApi, 
  getJobByIdApi, 
  setFilter 
} from '../../../redux/slices/jobsSlice.new';
import { Job } from '../../../types/job';

const JobListExample: React.FC = () => {
  const dispatch = useAppDispatch();
  const [localJobs, setLocalJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get filter from Redux store
  const filter = useAppSelector(state => state.jobs.filter);
  
  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);
  
  // Fetch jobs with the callback pattern
  const fetchJobs = () => {
    setIsLoading(true);
    
    dispatch(
      getJobsApi({
        params: {
          page: filter.page.toString(),
          pageSize: filter.pageSize.toString(),
          jobStatus: filter.jobStatus,
          verified: filter.verified,
          searchQuery: filter.searchQuery
        },
        finalCallback: () => {
          setIsLoading(false);
        },
        successCallback: (response) => {
          setLocalJobs(response.data || []);
          setError(null);
        },
        failureCallback: (error) => {
          setError(error instanceof Error ? error.message : 'An unknown error occurred');
        },
      })
    );
  };
  
  // Fetch job details with the callback pattern
  const fetchJobDetails = (jobId: string) => {
    setIsLoading(true);
    
    dispatch(
      getJobByIdApi({
        additionalParams: jobId,
        finalCallback: () => {
          setIsLoading(false);
        },
        successCallback: (response) => {
          setSelectedJob(response);
          setError(null);
        },
        failureCallback: (error) => {
          setError(error instanceof Error ? error.message : 'An unknown error occurred');
        },
      })
    );
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    dispatch(setFilter({ page }));
    fetchJobs();
  };
  
  // Handle job selection
  const handleJobSelect = (jobId: string) => {
    fetchJobDetails(jobId);
  };
  
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Jobs List Example</h2>
      
      {isLoading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : (
        <>
          <div className="grid gap-4">
            {localJobs.map(job => (
              <div 
                key={job._id}
                className={`p-4 border rounded cursor-pointer ${selectedJob?._id === job._id ? 'bg-blue-50 border-blue-500' : ''}`}
                onClick={() => handleJobSelect(job._id)}
              >
                <h3 className="font-medium">{job.name}</h3>
                <p className="text-sm text-gray-500">{job.description || 'No description'}</p>
                <div className="flex justify-between mt-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    job.status === 'completed' ? 'bg-green-100 text-green-800' :
                    job.status === 'failed' ? 'bg-red-100 text-red-800' :
                    job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {localJobs.length === 0 && (
            <div className="p-4 text-center text-gray-500">No jobs found</div>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              disabled={filter.page <= 1}
              onClick={() => handlePageChange(filter.page - 1)}
            >
              Previous
            </button>
            <span>Page {filter.page}</span>
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => handlePageChange(filter.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
      
      {selectedJob && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-bold">Selected Job Details</h3>
          <div className="mt-2 space-y-2">
            <p><span className="font-medium">Name:</span> {selectedJob.name}</p>
            <p><span className="font-medium">Description:</span> {selectedJob.description || 'No description'}</p>
            <p><span className="font-medium">Status:</span> {selectedJob.status}</p>
            <p><span className="font-medium">Created:</span> {new Date(selectedJob.created_at).toLocaleString()}</p>
            {selectedJob.executed_at && (
              <p><span className="font-medium">Executed:</span> {new Date(selectedJob.executed_at).toLocaleString()}</p>
            )}
            {selectedJob.completed_at && (
              <p><span className="font-medium">Completed:</span> {new Date(selectedJob.completed_at).toLocaleString()}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListExample;
