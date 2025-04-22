/**
 * Job Form Component
 *
 * Form for creating a new job. Used in the NewJobDialog component.
 */

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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { httpBase } from '@/utils/httpBase';
import { JOBS, PROCESSES } from '@/constants/apiEndpoints';
import { Job } from '../../../types';
import ProcessList from './ProcessList';
import { SchemaForm } from '@/components/ui/schema-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
});

type JobFormValues = z.infer<typeof jobFormSchema>;

interface ProcessSchema {
  [key: string]: {
    type: string;
    description: string;
    items?: {
      type: string;
      format?: string;
    };
    default?: string;
  };
}

interface Process {
  name: string;
  description: string;
  schema: ProcessSchema;
}

interface JobFormProps {
  projectId: string;
  onSuccess?: (job: Job) => void;
  onCancel?: () => void;
}

const JobForm: React.FC<JobFormProps> = ({
  projectId,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processes, setProcesses] = useState<Record<string, Process>>({});
  const [isLoadingProcesses, setIsLoadingProcesses] = useState(false);
  const [selectedProcessName, setSelectedProcessName] = useState<string>('');
  const [selectedProcessSchema, setSelectedProcessSchema] = useState<any>(null);

  // Initialize form
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      name: '',
      description: '',
      process_name: '',
    },
  });

  // Fetch available processes
  useEffect(() => {
    // Update selected process schema when process changes
    // This will be used when the eye button is clicked to view parameters
    if (selectedProcessName && processes[selectedProcessName]) {
      setSelectedProcessSchema({
        type: 'object',
        properties: processes[selectedProcessName].schema,
        required: ['urls'] // Assuming urls is always required
      });
    } else {
      setSelectedProcessSchema(null);
    }
  }, [selectedProcessName, processes]);

  useEffect(() => {
    const fetchProcesses = async () => {
      setIsLoadingProcesses(true);
      try {
        const response = await httpBase.get(PROCESSES.GET_PROCESSES);
        // The response should be an object with process names as keys
        if (response && typeof response === 'object' && !Array.isArray(response)) {
          setProcesses(response);
        } else {
          console.error('Unexpected processes response format:', response);
          setProcesses({});
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

  // Listen for schema form changes from the dialog
  useEffect(() => {
    const handleSchemaFormChange = (event: any) => {
      const { processName, data } = event.detail;
      if (processName === selectedProcessName) {
        form.setValue('parameters', data);
      }
    };

    document.addEventListener('schema-form-change', handleSchemaFormChange);
    return () => {
      document.removeEventListener('schema-form-change', handleSchemaFormChange);
    };
  }, [form, selectedProcessName]);

  // Update the form schema to include parameters
  const jobFormSchemaWithParams = jobFormSchema.extend({
    parameters: z.any().optional(),
  });

  const onSubmit = async (values: JobFormValues) => {
    if (!projectId) {
      toast({
        title: 'Error',
        description: 'Project ID is required to create a job.',
        variant: 'destructive',
      });
      return;
    }

    // Make sure we have the parameters from the schema form
    // This will be populated when the user interacts with the parameters dialog
    const parameters = form.getValues('parameters');
    const submitData = {
      ...values,
      parameters: parameters || {}
    };

    setIsSubmitting(true);
    try {
      const response = await httpBase.post(
        JOBS.CREATE_JOB(projectId),
        submitData
      );

      toast({
        title: 'Job Created',
        description: 'The job has been created successfully.',
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
              <FormControl>
                <div className="border rounded-md">
                  <ProcessList
                    processes={processes}
                    isLoading={isLoadingProcesses}
                    selectedProcess={field.value}
                    onSelectProcess={(processName) => {
                      field.onChange(processName);
                      setSelectedProcessName(processName);

                      // If process is unselected, clear the schema
                      if (processName === '') {
                        setSelectedProcessSchema(null);
                        return;
                      }

                      // Auto-fill job name based on process if empty
                      const currentName = form.getValues('name');
                      if (!currentName || currentName === '') {
                        const process = processes[processName];
                        if (process) {
                          const defaultName = `${process.name} Job`;
                          form.setValue('name', defaultName);
                        }
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Parameters are now only shown in the popover or dialog, not below the process selection */}

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
