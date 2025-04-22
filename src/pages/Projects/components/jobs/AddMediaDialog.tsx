import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { httpBase } from '@/utils/httpBase';
import { JOBS } from '@/constants/apiEndpoints';
import { Link, Loader2 } from 'lucide-react';

// Form validation schema
const mediaFormSchema = z.object({
  media_uri: z.string().url({
    message: 'Please enter a valid URL',
  }),
});

type MediaFormValues = z.infer<typeof mediaFormSchema>;

interface AddMediaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  onMediaAdded?: () => void;
}

const AddMediaDialog: React.FC<AddMediaDialogProps> = ({
  isOpen,
  onOpenChange,
  jobId,
  onMediaAdded,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaFormSchema),
    defaultValues: {
      media_uri: '',
    },
  });

  const onSubmit = async (values: MediaFormValues) => {
    if (!jobId) {
      toast({
        title: 'Error',
        description: 'Job ID is required to add media.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await httpBase.post(
        JOBS.ADD_MEDIA_FROM_URI(jobId),
        { media_uris: [values.media_uri] }
      );

      toast({
        title: 'File Added',
        description: 'The file has been successfully added to the job.',
      });

      if (onMediaAdded) {
        onMediaAdded();
      }

      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding media to job:', error);
      toast({
        title: 'Error',
        description: 'Failed to add file to job. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Files to Job</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="media_uri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-2 top-2.5 text-gray-500">
                        <Link size={16} />
                      </div>
                      <Input
                        placeholder="Enter file URL"
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Enter a URL to a file (image, audio, video, document) to be processed by this job.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add File'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMediaDialog;
