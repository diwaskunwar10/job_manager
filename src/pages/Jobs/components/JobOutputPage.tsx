
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '@/services/projectService';
import { useAppContext } from '@/context/AppContext';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const JobOutputPage: React.FC = () => {
  const { projectId, jobId } = useParams<{ slug: string; projectId: string; jobId: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();
  
  const [jobOutput, setJobOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch job output
  useEffect(() => {
    if (jobId) {
      setIsLoading(true);
      fetchJobOutput();
    }
  }, [jobId]);
  
  const fetchJobOutput = async () => {
    try {
      // In a real app, you'd fetch the job details too to show in breadcrumb
      // For now, we'll simulate this with mock data
      setJobDetails({
        _id: jobId,
        name: "Job #" + jobId?.substring(0, 5),
        status: "completed",
        project_id: projectId,
        project_name: "Project #" + projectId?.substring(0, 5),
        created_at: new Date().toISOString()
      });
      
      // In a real implementation, replace the hardcoded response with actual API call
      setTimeout(() => {
        const mockOutput = `Job execution output:
==================
Starting job execution...
Connecting to remote server...
Executing command: process data
Processing data batch 1/3...
Processing data batch 2/3...
Processing data batch 3/3...
Data processing complete
Generating report...
Report saved to: /data/reports/job_${jobId}.pdf
Job completed successfully!`;
        
        setJobOutput(mockOutput);
        setIsLoading(false);
      }, 1000);
      
      // In a real implementation, you would use:
      /*
      const response = await projectService.getJobOutput(jobId);
      setJobOutput(response.data.output);
      setIsLoading(false);
      */
    } catch (err) {
      console.error('Failed to fetch job output:', err);
      setError('Failed to load job output. Please try again later.');
      setIsLoading(false);
    }
  };

  // Get appropriate status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" className="capitalize">{status}</Badge>;
      case 'in_progress':
        return <Badge variant="info" className="capitalize">{status.replace('_', ' ')}</Badge>;
      case 'pending':
        return <Badge variant="warning" className="capitalize">{status}</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="capitalize">{status}</Badge>;
      default:
        return <Badge variant="secondary" className="capitalize">{status}</Badge>;
    }
  };

  // Format the date in a more readable way
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };
  
  // Go back to job list
  const handleBackToJobList = () => {
    navigate(`/${state.tenant?.slug}/projects/${projectId}`);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6 px-4 py-4">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${state.tenant?.slug}/projects`}>Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${state.tenant?.slug}/projects/${projectId}`}>
                {jobDetails?.project_name || `Project ${projectId?.substring(0, 5)}`}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {jobDetails?.name || `Job ${jobId?.substring(0, 5)}`}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBackToJobList}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Project Jobs
        </Button>

        {/* Job Details and Output */}
        <div className="bg-white rounded-lg shadow-md">
          {/* Job Header */}
          {jobDetails && (
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">{jobDetails.name}</h1>
                {getStatusBadge(jobDetails.status)}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>Project: {jobDetails.project_name}</p>
                <p>Created: {formatDate(jobDetails.created_at)}</p>
              </div>
            </div>
          )}

          {/* Job Output */}
          <div className="p-4">
            <h2 className="text-lg font-medium mb-3">Job Output</h2>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-t-4 border-b-4 border-brand-600 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 border border-red-200 rounded-md">
                {error}
              </div>
            ) : (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
                {jobOutput}
              </pre>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobOutputPage;
