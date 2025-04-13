
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchJobDetail, fetchJobOutput } from '../../redux/slices/jobsSlice';
import MainLayout from '../../components/Layout/MainLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, FileText, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const JobOutputPage: React.FC = () => {
  const { slug, jobId } = useParams<{ slug: string; jobId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { selectedJob, jobOutput, isJobDetailLoading, isOutputLoading, error } = useAppSelector(state => state.jobs);
  const tenant = useAppSelector(state => state.tenant.tenant);
  
  // Fetch job details and output when component mounts
  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobDetail(jobId));
      dispatch(fetchJobOutput(jobId));
    }
  }, [jobId, dispatch]);
  
  // Handle any errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  // Redirect if tenant not loaded
  useEffect(() => {
    if (!tenant) {
      navigate(`/${slug}`);
    }
  }, [tenant, slug, navigate]);

  if (!tenant) return null;
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Breadcrumb navigation */}
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to={`/${slug}/jobs`} className="text-gray-600 hover:text-gray-900">
                Jobs
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                {isJobDetailLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <Link to={`/${slug}/jobs`} className="text-gray-600 hover:text-gray-900">
                    {selectedJob?.name || 'Job Details'}
                  </Link>
                )}
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Output</span>
              </div>
            </li>
          </ol>
        </nav>
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/${slug}/jobs`)} 
              className="mb-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Jobs
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {isJobDetailLoading ? <Skeleton className="h-8 w-64" /> : selectedJob?.name || 'Job Output'}
            </h1>
          </div>
        </div>
        
        {/* Job summary card */}
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" /> Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isJobDetailLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ) : (
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${selectedJob?.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        selectedJob?.status === 'failed' ? 'bg-red-100 text-red-800' : 
                        selectedJob?.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {selectedJob?.status === 'in_progress' ? 'In Progress' : 
                        selectedJob?.status?.charAt(0).toUpperCase() + selectedJob?.status?.slice(1) || 'Unknown'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedJob?.created_at ? format(new Date(selectedJob.created_at), 'PPpp') : 'N/A'}
                  </dd>
                </div>
                {selectedJob?.executed_at && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Executed At</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {format(new Date(selectedJob.executed_at), 'PPpp')}
                    </dd>
                  </div>
                )}
                {selectedJob?.completed_at && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Completed At</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {format(new Date(selectedJob.completed_at), 'PPpp')}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Project</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedJob?.project_name || 'N/A'}
                  </dd>
                </div>
              </dl>
            )}
          </CardContent>
        </Card>
        
        {/* Output card */}
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" /> Job Output
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isOutputLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            ) : jobOutput ? (
              <div className="relative">
                <pre className="p-4 bg-gray-50 rounded-md border overflow-auto max-h-[60vh] whitespace-pre-wrap text-sm">
                  {jobOutput.output}
                </pre>
                {jobOutput.timestamp && (
                  <div className="text-xs text-gray-500 mt-2">
                    Output fetched at: {format(new Date(jobOutput.timestamp), 'PPpp')}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-500">No output is available for this job.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default JobOutputPage;
