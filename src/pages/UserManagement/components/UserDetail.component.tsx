import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import userService from '@/services/userService';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import {
  User,
  Mail,
  Calendar,
  Clock,
  Shield,
  Key,
  Save,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

interface UserDetailComponentProps {
  user: User;
  onRoleChange: (userId: string, newRole: string) => void;
  onPasswordReset: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
}

const UserDetailComponent: React.FC<UserDetailComponentProps> = ({
  user,
  onRoleChange,
  onPasswordReset,
  onDeleteUser
}) => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { toast } = useToast();

  // Confirmation dialog states
  const [isRoleChangeDialogOpen, setIsRoleChangeDialogOpen] = useState(false);
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isPasswordChangeDialogOpen, setIsPasswordChangeDialogOpen] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<string | null>(null);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle role change
  const handleRoleChange = (value: string) => {
    setPendingRoleChange(value);
    setIsRoleChangeDialogOpen(true);
  };

  // Confirm role change
  const confirmRoleChange = () => {
    if (pendingRoleChange) {
      onRoleChange(user._id, pendingRoleChange);
      setPendingRoleChange(null);
    }
  };

  // Handle password reset
  const handlePasswordReset = () => {
    setIsPasswordResetDialogOpen(true);
  };

  // Confirm password reset
  const confirmPasswordReset = () => {
    onPasswordReset(user._id);
  };

  // Handle delete user
  const handleDeleteUser = () => {
    setIsDeleteUserDialogOpen(true);
  };

  // Confirm delete user
  const confirmDeleteUser = () => {
    if (onDeleteUser) {
      onDeleteUser(user._id);
    }
  };

  // Handle change password
  const handleChangePassword = () => {
    // Reset error
    setPasswordError('');

    // Validate passwords
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    // Open confirmation dialog
    setIsPasswordChangeDialogOpen(true);
  };

  // Confirm password change
  const confirmPasswordChange = () => {
    // Call the service to change the password
    userService.changePassword(
      user._id,
      currentPassword,
      newPassword,
      {
        successCallback: () => {
          // Reset form and close dialog
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setIsChangePasswordOpen(false);

          // Show success message
          toast({
            title: 'Password Changed',
            description: 'Your password has been successfully updated.'
          });
        },
        failureCallback: (error) => {
          console.error('Error changing password:', error);
          setPasswordError('Failed to change password. Please check your current password and try again.');
        }
      }
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">User Details</h2>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center text-gray-500 text-sm">
              <User className="w-4 h-4 mr-2" />
              <span>Username</span>
            </div>
            <p className="text-gray-900">{user.username}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-500 text-sm">
              <Mail className="w-4 h-4 mr-2" />
              <span>Email</span>
            </div>
            <p className="text-gray-900">{user.email || 'No email'}</p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Created At</span>
            </div>
            <p className="text-gray-900">{user.createdAt ? formatDate(user.createdAt) : 'Unknown'}</p>
          </div>

          {user.lastLogin && (
            <div className="space-y-2">
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                <span>Last Login</span>
              </div>
              <p className="text-gray-900">{formatDate(user.lastLogin)}</p>
            </div>
          )}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-500 text-sm">
            <Shield className="w-4 h-4 mr-2" />
            <span>Role</span>
          </div>
          <Select defaultValue={user.role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-full md:w-1/3">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Password Management */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Password Management</h3>

          <div className="flex flex-col md:flex-row gap-4">
            <Button
              variant="outline"
              onClick={() => setIsChangePasswordOpen(true)}
              className="flex items-center"
            >
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </Button>

            <Button
              variant="outline"
              onClick={() => handlePasswordReset(user.id)}
              className="flex items-center"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Password Reset Email
            </Button>

            {onDeleteUser && (
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                className="flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete User
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {passwordError && (
              <div className="text-sm text-red-500 p-2 bg-red-50 rounded">
                {passwordError}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="current-password" className="text-sm font-medium text-gray-700">
                Current Password
              </label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword} className="flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={isRoleChangeDialogOpen}
        onClose={() => setIsRoleChangeDialogOpen(false)}
        onConfirm={confirmRoleChange}
        title="Change User Role"
        description={`Are you sure you want to change ${user.username}'s role to ${pendingRoleChange}?`}
        confirmText="Change Role"
        variant="default"
      />

      <ConfirmationDialog
        isOpen={isPasswordResetDialogOpen}
        onClose={() => setIsPasswordResetDialogOpen(false)}
        onConfirm={confirmPasswordReset}
        title="Reset Password"
        description={`Are you sure you want to send a password reset email to ${user.username}?`}
        confirmText="Send Reset Email"
        variant="default"
      />

      <ConfirmationDialog
        isOpen={isDeleteUserDialogOpen}
        onClose={() => setIsDeleteUserDialogOpen(false)}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete user ${user.username}? This action cannot be undone.`}
        confirmText="Delete User"
        variant="destructive"
      />

      <ConfirmationDialog
        isOpen={isPasswordChangeDialogOpen}
        onClose={() => setIsPasswordChangeDialogOpen(false)}
        onConfirm={confirmPasswordChange}
        title="Change Password"
        description="Are you sure you want to change your password?"
        confirmText="Change Password"
        variant="default"
      />
    </div>
  );
};

export default UserDetailComponent;
