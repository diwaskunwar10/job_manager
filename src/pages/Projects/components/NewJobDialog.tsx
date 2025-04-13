
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface NewJobDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

const NewJobDialog: React.FC<NewJobDialogProps> = ({ isOpen, onOpenChange, projectId }) => {
  const [newJobName, setNewJobName] = useState('');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [newJobPrompt, setNewJobPrompt] = useState('');
  const { toast } = useToast();

  const handleCreateJob = () => {
    // Validate form
    if (!newJobName.trim()) {
      toast({
        title: "Error",
        description: "Job name is required",
        variant: "destructive"
      });
      return;
    }

    // Here you would call the API to create a new job
    console.log('Creating new job:', {
      name: newJobName,
      description: newJobDescription,
      prompt: newJobPrompt,
      projectId
    });

    toast({
      title: "Job Created",
      description: "The job has been created successfully."
    });

    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setNewJobName('');
    setNewJobDescription('');
    setNewJobPrompt('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="job-name" className="text-right text-sm font-medium">
              Name
            </label>
            <Input
              id="job-name"
              placeholder="Enter job name"
              className="col-span-3"
              value={newJobName}
              onChange={(e) => setNewJobName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="job-description" className="text-right text-sm font-medium">
              Description
            </label>
            <Input
              id="job-description"
              placeholder="Enter job description"
              className="col-span-3"
              value={newJobDescription}
              onChange={(e) => setNewJobDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="job-prompt" className="text-right text-sm font-medium">
              Prompt
            </label>
            <textarea
              id="job-prompt"
              placeholder="Enter job prompt"
              className="col-span-3 min-h-[100px] border rounded-md p-2"
              value={newJobPrompt}
              onChange={(e) => setNewJobPrompt(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateJob}
            disabled={!newJobName.trim()}
          >
            Create Job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewJobDialog;
