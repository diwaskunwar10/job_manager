import React, { useState, useEffect, useCallback, useRef } from 'react';
import UserListComponent from '../components/UserList.component';
import UserDetailComponent from '../components/UserDetail.component';
import InviteUserComponent from '../components/InviteUser.component';
import SearchComponent from '../components/Search.component';
import { useToast } from '@/hooks/use-toast';
import userService, { User } from '@/services/userService';

const UserManagementContainer: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [documentsPerPage, setDocumentsPerPage] = useState(12);
  const { toast } = useToast();

  // Debounce search to avoid too many API calls
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch users function
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);

    userService.getSubordinateUsers(
      currentPage,
      documentsPerPage,
      searchQuery,
      {
        successCallback: (response) => {
          // Use the actual API response data
          const { documents, total_pages, current_page, total_documents } = response;

          // Set the users from the API response
          setUsers(documents);
          setTotalPages(total_pages);

          // Log the response for debugging
          console.log('Users fetched:', {
            users: documents,
            totalPages: total_pages,
            currentPage: current_page,
            totalDocuments: total_documents
          });
          setIsLoading(false);
        },
        failureCallback: (error) => {
          console.error('Error fetching users:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch users. Please try again.',
            variant: 'destructive'
          });
          setIsLoading(false);
        },
        finalCallback: () => {
          // This will be called regardless of success or failure
        }
      }
    );
  }, [currentPage, documentsPerPage, searchQuery, toast]);

  // Fetch users on component mount and when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle search query changes with debounce
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Only fetch if the query is not empty
    if (query.trim() !== '') {
      // Set a new timeout to fetch after 500ms of inactivity
      searchTimeoutRef.current = setTimeout(() => {
        setCurrentPage(1); // Reset to first page when searching
        fetchUsers();
      }, 500);
    } else {
      // If query is empty, fetch without the search parameter
      setCurrentPage(1);
      fetchUsers();
    }
  };

  // Handle user selection
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  // Handle user role change
  const handleRoleChange = (userId: string, newRole: 'admin' | 'user' | 'manager') => {
    setIsLoading(true);

    userService.changeUserRole(
      userId,
      newRole,
      {
        successCallback: () => {
          // Update local state after successful API call
          setUsers(prevUsers =>
            prevUsers.map(user =>
              user._id === userId ? { ...user, role: newRole } : user
            )
          );

          if (selectedUser && selectedUser._id === userId) {
            setSelectedUser({ ...selectedUser, role: newRole });
          }

          toast({
            title: 'Role Updated',
            description: `User role has been updated to ${newRole}.`
          });
        },
        failureCallback: (error) => {
          console.error('Error changing user role:', error);
          toast({
            title: 'Error',
            description: 'Failed to update user role. Please try again.',
            variant: 'destructive'
          });
        },
        finalCallback: () => {
          setIsLoading(false);
        }
      }
    );
  };

  // Handle password reset
  const handlePasswordReset = (userId: string) => {
    setIsLoading(true);

    userService.resetUserPassword(
      userId,
      {
        successCallback: () => {
          toast({
            title: 'Password Reset Email Sent',
            description: 'A password reset link has been sent to the user\'s email.'
          });
        },
        failureCallback: (error) => {
          console.error('Error resetting password:', error);
          toast({
            title: 'Error',
            description: 'Failed to send password reset email. Please try again.',
            variant: 'destructive'
          });
        },
        finalCallback: () => {
          setIsLoading(false);
        }
      }
    );
  };

  // Handle user invitation
  const handleInviteUser = (email: string, role: 'admin' | 'user' | 'manager') => {
    setIsLoading(true);

    userService.inviteUser(
      email,
      role,
      {
        successCallback: () => {
          // For demo purposes, add a mock user to the list
          const newUser: User = {
            _id: `${users.length + 1}`,
            username: email.split('@')[0], // Temporary name based on email
            email,
            role,
            tenant_id: '123',
            createdAt: new Date().toISOString()
          };

          setUsers(prevUsers => [...prevUsers, newUser]);
          setIsInviteModalOpen(false);

          toast({
            title: 'User Invited',
            description: `Invitation sent to ${email}.`
          });
        },
        failureCallback: (error) => {
          console.error('Error inviting user:', error);
          toast({
            title: 'Error',
            description: 'Failed to invite user. Please try again.',
            variant: 'destructive'
          });
        },
        finalCallback: () => {
          setIsLoading(false);
        }
      }
    );
  };

  // Handle user deletion
  const handleDeleteUser = (userId: string) => {
    setIsLoading(true);

    userService.deleteUser(
      userId,
      {
        successCallback: () => {
          // Remove the user from the local state
          setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));

          // Clear the selected user if it was deleted
          if (selectedUser && selectedUser._id === userId) {
            setSelectedUser(null);
          }

          toast({
            title: 'User Deleted',
            description: 'The user has been successfully deleted.'
          });
        },
        failureCallback: (error) => {
          console.error('Error deleting user:', error);
          toast({
            title: 'Error',
            description: 'Failed to delete user. Please try again.',
            variant: 'destructive'
          });
        },
        finalCallback: () => {
          setIsLoading(false);
        }
      }
    );
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <SearchComponent onSearch={handleSearchChange} />
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Invite User
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* User List */}
        <div className="w-full md:w-1/3 overflow-auto border rounded-lg bg-white">
          <UserListComponent
            users={users}
            selectedUserId={selectedUser?._id}
            onUserSelect={handleUserSelect}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* User Details */}
        <div className="w-full md:w-2/3 overflow-auto border rounded-lg bg-white">
          {selectedUser ? (
            <UserDetailComponent
              user={selectedUser}
              onRoleChange={handleRoleChange}
              onPasswordReset={handlePasswordReset}
              onDeleteUser={handleDeleteUser}
            />
          ) : (
            <div className="flex items-center justify-center h-full p-6 text-gray-500">
              Select a user to view details
            </div>
          )}
        </div>
      </div>

      {/* Invite User Modal */}
      <InviteUserComponent
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUser}
      />
    </div>
  );
};

export default UserManagementContainer;
