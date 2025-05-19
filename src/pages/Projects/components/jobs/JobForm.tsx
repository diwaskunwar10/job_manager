import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { httpBase } from '@/utils/httpBase';
import { JOBS, PROCESSES } from '@/constants/apiEndpoints';
import { Link } from 'lucide-react';

// Form validation schema
const jobFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Job name must be at least 3 characters.',
  }).max(100, {
    message: 'Job name must not exceed 100 characters.',
  }),
  description: z.string().max(500, {
    message: 'Description must not exceed 500 characters.',
  }).optional(),
  process_name: z.string({
    required_error: 'Please select a process type.',
  }),
  media_uri: z.string().url({
    message: 'Please enter a valid URL',
  }).optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

interface Process {
  name: string;
  display_name: string;
  description: string;
}

interface JobFormProps {
  projectId: string;
  onSuccess?: (job: any) => void;
  onCancel?: () => void;
}

const JobForm: React.FC<JobFormProps> = ({
  projectId,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isLoadingProcesses, setIsLoadingProcesses] = useState(false);

  // Initialize form
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      name: '',
      description: '',
      process_name: '',
      media_uri: '',
    },
  });

  // Fetch available processes
  useEffect(() => {
    const fetchProcesses = async () => {
      setIsLoadingProcesses(true);
      try {
        const response = await httpBase.get(PROCESSES.GET_PROCESSES);
        // Ensure processes is always an array
        if (response && Array.isArray(response)) {
          setProcesses(response);
        } else if (response && response.data && Array.isArray(response.data)) {
          setProcesses(response.data);
        } else {
          console.error('Unexpected processes response format:', response);
          setProcesses([]);
        }
      } catch (error) {
        console.error('Error fetching processes:', error);
        toast({
          title: 'Error',
          description: 'Failed to load available processes. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingProcesses(false);
      }
    };

    fetchProcesses();
  }, [toast]);

  // Function to upload media to job
  const uploadMediaToJob = async (jobId: string, mediaUri: string) => {
    if (!mediaUri) return true; // Return success if no media URI

    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('media_uris', mediaUri);

      await httpBase.post(
        JOBS.ADD_MEDIA(jobId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(`Successfully added media from ${mediaUri} to job ${jobId}`);
      return true; // Return success
    } catch (error) {
      console.error('Error adding media to job:', error);
      toast({
        title: 'Warning',
        description: 'Job created, but failed to add media. You can try adding media later.',
        variant: 'destructive',
      });
      return false; // Return failure
    }
  };

  const onSubmit = async (values: JobFormValues) => {
    if (!projectId) {
      toast({
        title: 'Error',
        description: 'Project ID is required to create a job.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create job without media first
      const jobData = {
        name: values.name,
        description: values.description,
        process_name: values.process_name
      };

      const response = await httpBase.post(
        JOBS.CREATE_JOB(projectId),
        jobData
      );

      // Store the created job ID
      const jobId = response._id;

      // If media URI is provided, upload it to the job
      let mediaSuccess = true;
      if (values.media_uri) {
        mediaSuccess = await uploadMediaToJob(jobId, values.media_uri);
      }

      toast({
        title: 'Job Created',
        description: mediaSuccess
          ? 'The job has been created successfully with all media.'
          : 'The job has been created, but there was an issue with the media upload.',
      });

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to create job. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter job name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter job description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="process_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Process Type</FormLabel>
              <Select
                disabled={isLoadingProcesses}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a process type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingProcesses ? (
                    <SelectItem value="loading" disabled>
                      Loading processes...
                    </SelectItem>
                  ) : !Array.isArray(processes) || processes.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No processes available
                    </SelectItem>
                  ) : (
                    processes.map((process) => (
                      <SelectItem key={process.name} value={process.name}>
                        {process.display_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="media_uri"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Media URL</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute left-2 top-2.5 text-gray-500">
                      <Link size={16} />
                    </div>
                    <Input
                      placeholder="Enter media URL (optional)"
                      className="pl-8"
                      {...field}
                    />
                  </div>
                </div>
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Enter a URL to an image, audio, or video file to be processed by this job. You can also add media files later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || isLoadingProcesses}>
            {isSubmitting ? 'Creating...' : 'Create Job'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobForm;
