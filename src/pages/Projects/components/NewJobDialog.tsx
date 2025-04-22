import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import JobForm from './jobs/JobForm';

interface NewJobDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onJobCreated?: (job: any) => void;
}

const NewJobDialog: React.FC<NewJobDialogProps> = ({
  isOpen,
  onOpenChange,
  projectId,
  onJobCreated
}) => {
  const { toast } = useToast();

  const handleSuccess = (job: any) => {
    toast({
      title: "Job Created",
      description: "The job has been created successfully."
    });

    if (onJobCreated) {
      onJobCreated(job);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
        </DialogHeader>
        <JobForm
          projectId={projectId}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewJobDialog;
