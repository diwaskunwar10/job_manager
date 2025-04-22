/**
 * Project Form Component
 * 
 * Form for creating or editing a project. Used in both the NewProjectDialog and EditProjectDialog.
 */

import React, { useState } from 'react';
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
import { PROJECTS } from '@/constants/apiEndpoints';
import { Project } from '../../types';

// Form validation schema
const projectFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Project name must be at least 3 characters.',
  }).max(100, {
    message: 'Project name must not exceed 100 characters.',
  }),
  description: z.string().max(500, {
    message: 'Description must not exceed 500 characters.',
  }).optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  projectId?: string;
  initialData?: {
    name?: string;
    description?: string;
  };
  onSuccess?: (project: Project) => void;
  onCancel?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  projectId,
  initialData,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!projectId;

  // Initialize form with default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      let response;

      if (isEditing) {
        // Update existing project
        response = await httpBase.put(
          PROJECTS.UPDATE_PROJECT(projectId),
          values
        );
        toast({
          title: 'Project Updated',
          description: 'The project has been updated successfully.',
        });
      } else {
        // Create new project
        response = await httpBase.post(
          PROJECTS.CREATE_PROJECT,
          values
        );
        toast({
          title: 'Project Created',
          description: 'The project has been created successfully.',
        });
      }

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} project. Please try again.`,
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
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
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
                  placeholder="Enter project description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
