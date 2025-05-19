/**
 * Job Output View Component
 *
 * Displays the output of a job, including input and output content.
 * Provides navigation between multiple outputs if available.
 */

import React, { useState, useEffect } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import jobService from '@/services/jobService';
import { mediaService } from '@/services/mediaService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch } from '@/redux/hooks';
import { setActiveTab } from '@/redux/slices/projectJobsNavigationSlice';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

// Import types from job.ts
import { JobItem, MediaContent } from '@/types/job';

interface JobOutputViewProps {
  jobId: string;
  jobName: string;
  projectId: string; // Needed for API calls or future use
  projectName: string;
  onBack: () => void;
}

const JobOutputView: React.FC<JobOutputViewProps> = ({
  jobId,
  jobName,
  // projectId is available but not currently used
  projectName,
  onBack
}) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  // State for job items and navigation
  const [isLoading, setIsLoading] = useState(true);
  const [jobItems, setJobItems] = useState<JobItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);

  // State for input/output content
  const [inputContent, setInputContent] = useState<MediaContent | null>(null);
  const [outputContent, setOutputContent] = useState<MediaContent | null>(null);
  const [inputPresignedUrl, setInputPresignedUrl] = useState<string | null>(null);
  const [outputPresignedUrl, setOutputPresignedUrl] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobOutput(jobId);
    }
  }, [jobId]);

  // When the current item index changes, fetch the input and output content
  useEffect(() => {
    if (jobItems.length > 0 && currentItemIndex < jobItems.length) {
      const currentItem = jobItems[currentItemIndex];
      fetchMediaContent(currentItem.input_id, currentItem.output_id);
    }
  }, [jobItems, currentItemIndex]);

  // Fetch job output items
  const fetchJobOutput = (jobId: string) => {
    setIsLoading(true);
    setJobItems([]);
    setInputContent(null);
    setOutputContent(null);

    jobService.getJobOutput(jobId)
      .then((response) => {
        console.log('Job output response:', response);
        if (response && response.data && Array.isArray(response.data)) {
          setJobItems(response.data);
          // If we have items, fetch the first one's content
          if (response.data.length > 0) {
            setCurrentItemIndex(0);
            // The content will be fetched by the useEffect that watches currentItemIndex
          }
        } else {
          setJobItems([]);
          toast({
            title: "No Output Items",
            description: "This job doesn't have any output items.",
            variant: "default"
          });
        }
      })
      .catch(error => {
        console.error("Error fetching job output:", error);
        setJobItems([]);
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

  // Fetch media content for input and output
  const fetchMediaContent = (inputId: string, outputId: string) => {
    setIsLoadingContent(true);
    setInputContent(null);
    setOutputContent(null);
    setInputPresignedUrl(null);
    setOutputPresignedUrl(null);

    // Fetch input content
    const fetchInput = jobService.getMediaContent(inputId)
      .then(response => {
        console.log('Input content response:', response);
        setInputContent(response);

        // Get presigned URL for input content if object_name exists
        if (response && response.object_name) {
          return mediaService.getPresignedUrl(response.object_name)
            .then(urlResponse => {
              if (urlResponse && urlResponse.presigned_url) {
                setInputPresignedUrl(urlResponse.presigned_url);
              }
              return response;
            })
            .catch(error => {
              console.error("Error fetching input presigned URL:", error);
              return response;
            });
        }
        return response;
      })
      .catch(error => {
        console.error("Error fetching input content:", error);
        return null;
      });

    // Fetch output content
    const fetchOutput = jobService.getMediaContent(outputId)
      .then(response => {
        console.log('Output content response:', response);
        setOutputContent(response);

        // Get presigned URL for output content if object_name exists
        if (response && response.object_name) {
          return mediaService.getPresignedUrl(response.object_name)
            .then(urlResponse => {
              if (urlResponse && urlResponse.presigned_url) {
                setOutputPresignedUrl(urlResponse.presigned_url);
              }
              return response;
            })
            .catch(error => {
              console.error("Error fetching output presigned URL:", error);
              return response;
            });
        }
        return response;
      })
      .catch(error => {
        console.error("Error fetching output content:", error);
        return null;
      });

    // Wait for both requests to complete
    Promise.all([fetchInput, fetchOutput])
      .finally(() => {
        setIsLoadingContent(false);
      });
  };

  // Navigate to next item
  const handleNextItem = () => {
    if (currentItemIndex < jobItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };

  // Navigate to previous item
  const handlePreviousItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  // Render content based on its type
  const renderContent = (content: MediaContent | null, presignedUrl: string | null) => {
    if (!content) return <div>No content available</div>;

    // Handle image content
    if (content.content_type?.includes('image/') ||
        (content.filename && (
          content.filename.endsWith('.jpg') || content.filename.endsWith('.png') ||
          content.filename.endsWith('.jpeg') || content.filename.endsWith('.gif')
        ))) {
      return (
        <div className="flex justify-center">
          <img
            src={presignedUrl || 'https://placehold.co/400x300?text=Image+Not+Available'}
            alt={content.filename || 'Content image'}
            className="max-h-80 object-contain rounded-md shadow-sm"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
            }}
          />
        </div>
      );
    }

    // Handle video content
    if (content.content_type?.includes('video/') ||
        (content.filename && (
          content.filename.endsWith('.mp4') || content.filename.endsWith('.webm') ||
          content.filename.endsWith('.mov') || content.filename.endsWith('.avi')
        ))) {
      return (
        <div className="flex justify-center">
          <video
            src={presignedUrl || ''}
            controls
            className="max-h-80 w-full object-contain rounded-md shadow-sm"
          />
        </div>
      );
    }

    // Handle audio content
    if (content.content_type?.includes('audio/') ||
        (content.filename && (
          content.filename.endsWith('.mp3') || content.filename.endsWith('.wav') ||
          content.filename.endsWith('.ogg') || content.filename.endsWith('.aac')
        ))) {
      return (
        <div className="flex justify-center w-full">
          <audio
            src={presignedUrl || ''}
            controls
            className="w-full rounded-md shadow-sm"
          />
        </div>
      );
    }

    // Handle text or JSON content
    return (
      <div className="text-sm font-mono bg-white p-4 rounded-md border border-gray-100 shadow-sm overflow-auto max-h-80">
        {content.content_type?.includes('application/json') || content.filename?.endsWith('.json')
          ? JSON.stringify(content, null, 2)
          : presignedUrl
            ? <a href={presignedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Download {content.filename || 'file'}
              </a>
            : JSON.stringify(content, null, 2)
        }
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      {/* Breadcrumb navigation */}
      <div className="p-5 border-b bg-white shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={onBack} className="text-gray-600 hover:text-primary transition-colors">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={onBack} className="text-gray-600 hover:text-primary transition-colors">{projectName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={(e) => {
                  e.preventDefault();
                  // Set active tab to 'jobs' before navigating back
                  dispatch(setActiveTab('jobs'));
                  // Ensure the selectedJobId is preserved in Redux
                  // We don't need to dispatch setSelectedJobId again since it's already set
                  // when the job was initially selected
                  onBack();
                }}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Jobs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">{jobName} Output</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Job output content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Job Output: {jobName}</h2>
            <div className="flex flex-wrap gap-4">
              <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Job ID: {jobId}</p>
              {jobItems.length > 0 && (
                <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Status: {jobItems[currentItemIndex]?.status || 'Unknown'}
                </p>
              )}
            </div>
          </div>

          {/* Item navigation */}
          {jobItems.length > 0 && (
            <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Input/Output Pair:</h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousItem}
                    disabled={currentItemIndex === 0 || isLoading}
                    className="rounded-lg bg-white border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                    {currentItemIndex + 1} of {jobItems.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextItem}
                    disabled={currentItemIndex >= jobItems.length - 1 || isLoading}
                    className="rounded-lg bg-white border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Item tabs for quick navigation */}
              <Tabs
                value={currentItemIndex.toString()}
                onValueChange={(value) => setCurrentItemIndex(parseInt(value))}
                className="w-full"
              >
                <TabsList className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto w-full justify-start p-1 h-auto bg-gray-50/70 rounded-lg">
                  {jobItems.map((item, index) => (
                    <TabsTrigger
                      key={`${item.input_id}-${item.output_id}`}
                      value={index.toString()}
                      className="text-xs py-1.5 px-3 h-auto rounded-md"
                    >
                      Pair {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Input/Output content side by side */}
          {jobItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Input content */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Input:</h3>
                <div className="p-5 bg-gray-50/70 rounded-lg border border-gray-100 min-h-[300px]">
                  {isLoadingContent ? (
                    <div className="flex items-center justify-center h-40">
                      <Loader2 className="h-6 w-6 animate-spin text-primary/70" />
                      <span className="ml-3 text-gray-600 font-medium">Loading input...</span>
                    </div>
                  ) : (
                    renderContent(inputContent, inputPresignedUrl)
                  )}
                </div>
              </div>

              {/* Output content */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Output:</h3>
                <div className="p-5 bg-gray-50/70 rounded-lg border border-gray-100 min-h-[300px]">
                  {isLoadingContent ? (
                    <div className="flex items-center justify-center h-40">
                      <Loader2 className="h-6 w-6 animate-spin text-primary/70" />
                      <span className="ml-3 text-gray-600 font-medium">Loading output...</span>
                    </div>
                  ) : (
                    renderContent(outputContent, outputPresignedUrl)
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading or no items message */}
          {isLoading ? (
            <div className="flex items-center justify-center h-40 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
              <span className="ml-3 text-gray-600 font-medium">Loading job output...</span>
            </div>
          ) : jobItems.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 gap-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <span className="text-gray-500 font-medium">No output data available</span>
              <span className="text-xs text-gray-400">The job may still be processing or has no output</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobOutputView;
