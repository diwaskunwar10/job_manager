import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Mail, UserPlus } from 'lucide-react';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';

interface InviteUserComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: 'admin' | 'user' | 'manager') => void;
}

const InviteUserComponent: React.FC<InviteUserComponentProps> = ({
  isOpen,
  onClose,
  onInvite
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'user' | 'manager'>('user');
  const [error, setError] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Handle form submission
  const handleSubmit = () => {
    // Reset error
    setError('');

    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Open confirmation dialog
    setIsConfirmDialogOpen(true);
  };

  // Confirm invitation
  const confirmInvite = () => {
    // Call the onInvite function
    onInvite(email, role);

    // Reset form
    setEmail('');
    setRole('user');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Invite New User
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <div className="text-sm text-red-500 p-2 bg-red-50 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-700">
                Role
              </label>
              <Select value={role} onValueChange={(value) => setRole(value as 'admin' | 'user' | 'manager')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {role === 'admin' && 'Admins have full access to all features and settings.'}
                {role === 'manager' && 'Managers can manage projects and users but have limited access to settings.'}
                {role === 'user' && 'Users have basic access to assigned projects and jobs.'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex items-center">
              <UserPlus className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmInvite}
        title="Invite User"
        description={`Are you sure you want to invite ${email} as a ${role}?`}
        confirmText="Send Invitation"
        variant="default"
      />
    </>
  );
};

export default InviteUserComponent;
