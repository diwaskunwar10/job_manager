import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { httpBase } from '@/utils/httpBase';
import { PROJECTS } from '@/constants/apiEndpoints';
import Confirmation from '@/components/ui/confirmation';

interface DeleteProjectButtonProps {
  projectId: string;
  projectName: string;
  onProjectDeleted?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const DeleteProjectButton: React.FC<DeleteProjectButtonProps> = ({
  projectId,
  projectName,
  onProjectDeleted,
  variant = 'outline',
  size = 'sm',
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await httpBase.delete(PROJECTS.DELETE_PROJECT(projectId));
      
      toast({
        title: 'Project Deleted',
        description: 'The project has been deleted successfully.',
      });
      
      if (onProjectDeleted) {
        onProjectDeleted();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size}
        onClick={() => setIsConfirmOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
      
      <Confirmation
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        description={
          <>
            Are you sure you want to delete the project <strong>{projectName}</strong>?
            This action cannot be undone and all associated data will be permanently deleted.
          </>
        }
        confirmText="Delete Project"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="destructive"
      />
    </>
  );
};

export default DeleteProjectButton;
