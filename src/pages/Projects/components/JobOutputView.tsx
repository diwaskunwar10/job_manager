import React, { useState, useEffect } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectService } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OutputItem from './jobs/OutputItem';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setActiveTab } from '@/redux/slices/projectJobsNavigationSlice';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

// Define interfaces for job output data structure
interface OutputItem {
  output_id: string;
  source_media_id: string;
  object_name: string;
  process_type: string;
  result: any; // This could be further typed based on different process types
}

interface JobOutputData {
  job_id: string;
  status: string;
  outputs: OutputItem[];
}

interface JobOutputViewProps {
  jobId: string;
  jobName: string;
  projectId: string;
  projectName: string;
  onBack: () => void;
}

const JobOutputView: React.FC<JobOutputViewProps> = ({
  jobId,
  jobName,
  projectId,
  projectName,
  onBack
}) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const savedNavigation = useAppSelector(state => state.projectJobsNavigation);
  const [isLoading, setIsLoading] = useState(true);
  const [jobOutput, setJobOutput] = useState<JobOutputData | null>(null);
  const [jobInput, setJobInput] = useState<string>('');
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [currentJobIndex, setCurrentJobIndex] = useState<number>(0);

  // State for output navigation
  const [currentOutputIndex, setCurrentOutputIndex] = useState<number>(0);

  useEffect(() => {
    if (jobId) {
      fetchJobOutput(jobId);
    }
  }, [jobId]);

  // Fetch job output
  const fetchJobOutput = (jobId: string) => {
    setIsLoading(true);

    projectService.getJobOutput(jobId, false)
      .then((response) => {
        console.log('Job output response:', response);
        if (response) {
          setJobOutput(response);
          setJobInput(response.inputs || response.input || '');
          // Reset output index when loading new job
          setCurrentOutputIndex(0);
        } else {
          setJobOutput(null);
          setJobInput('');
        }
        setTotalJobs(response.total_jobs || 0);
      })
      .catch(error => {
        console.error("Error fetching job output:", error);
        setJobOutput(null);
        setJobInput('');
        setTotalJobs(0);
        toast({
          title: "Error Fetching Job Output",
          description: "Failed to fetch job output. Please try again.",
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Navigate to next output
  const handleNextOutput = () => {
    if (jobOutput && currentOutputIndex < jobOutput.outputs.length - 1) {
      setCurrentOutputIndex(currentOutputIndex + 1);
    }
  };

  // Navigate to previous output
  const handlePreviousOutput = () => {
    if (currentOutputIndex > 0) {
      setCurrentOutputIndex(currentOutputIndex - 1);
    }
  };

  // Get current output
  const getCurrentOutput = () => {
    if (!jobOutput || !jobOutput.outputs || jobOutput.outputs.length === 0) {
      return null;
    }
    return jobOutput.outputs[currentOutputIndex];
  };

  // Render output content using the OutputItem component
  const renderOutputContent = (output: OutputItem) => {
    if (!output) return <div>No output data available</div>;
    return <OutputItem output={output} />;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb navigation */}
      <div className="p-4 border-b">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={onBack}>Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={onBack}>{projectName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={(e) => {
                  e.preventDefault();
                  // Set active tab to 'jobs' before navigating back
                  dispatch(setActiveTab('jobs'));
                  onBack();
                }}
              >
                Jobs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{jobName} Output</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Job output content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Job Output: {jobName}</h2>
          <p className="text-sm text-gray-500">Job ID: {jobId}</p>
          {jobOutput && jobOutput.status && (
            <p className="text-sm text-gray-500">Status: {jobOutput.status}</p>
          )}
        </div>

        {jobInput && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Input:</h3>
            <div className="p-4 bg-gray-50 rounded-md border">
              {typeof jobInput === 'string' && (jobInput.endsWith('.jpg') || jobInput.endsWith('.png') || jobInput.endsWith('.jpeg') || jobInput.endsWith('.gif')) ? (
                <div className="flex justify-center">
                  <img
                    src={jobInput}
                    alt="Input image"
                    className="max-h-60 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                    }}
                  />
                </div>
              ) : (
                <div className="text-sm">{typeof jobInput === 'string' ? jobInput : JSON.stringify(jobInput, null, 2)}</div>
              )}
            </div>
          </div>
        )}

        {/* Output navigation */}
        {jobOutput && jobOutput.outputs && jobOutput.outputs.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Output:</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousOutput}
                  disabled={currentOutputIndex === 0 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="text-sm">
                  {currentOutputIndex + 1} of {jobOutput.outputs.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextOutput}
                  disabled={currentOutputIndex >= jobOutput.outputs.length - 1 || isLoading}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Output tabs for quick navigation */}
            <Tabs
              value={currentOutputIndex.toString()}
              onValueChange={(value) => setCurrentOutputIndex(parseInt(value))}
              className="w-full"
            >
              <TabsList className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto w-full justify-start p-1 h-auto">
                {jobOutput.outputs.map((output, index) => (
                  <TabsTrigger
                    key={output.output_id}
                    value={index.toString()}
                    className="text-xs py-1 px-2 h-auto"
                  >
                    Output {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        <div className="mb-6">
          <div className="p-4 bg-gray-100 rounded-md min-h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading job output...</span>
              </div>
            ) : jobOutput && jobOutput.outputs && jobOutput.outputs.length > 0 ? (
              renderOutputContent(getCurrentOutput()!)
            ) : (
              <div className="flex items-center justify-center h-40">
                <span className="text-gray-500">No output data available</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOutputView;
