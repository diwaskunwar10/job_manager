/**
 * New Project Dialog Component
 * 
 * Dialog for creating a new project. Contains a form for entering project details.
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProjectForm from '../detail/ProjectForm';
import { Project } from '../../types';

interface NewProjectDialogProps {
  onProjectCreated?: (project: Project) => void;
  trigger?: React.ReactNode;
}

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({
  onProjectCreated,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = (project: Project) => {
    setOpen(false);
    if (onProjectCreated) {
      onProjectCreated(project);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <ProjectForm
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
