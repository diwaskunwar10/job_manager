import React from 'react';
import { Loader2 } from 'lucide-react';
import { User } from '@/services/userService';

interface UserListComponentProps {
  users: User[];
  selectedUserId: string | undefined;
  onUserSelect: (user: User) => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UserListComponent: React.FC<UserListComponentProps> = ({
  users,
  selectedUserId,
  onUserSelect,
  isLoading,
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'user':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 p-6 text-gray-500">
        No users found
      </div>
    );
  }

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center p-4 border-t">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 mx-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 mx-1 rounded ${currentPage === page ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="divide-y flex-1 overflow-y-auto">
        {users.map(user => (
          <div
            key={user._id}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedUserId === user._id ? 'bg-gray-100' : ''
            }`}
            onClick={() => onUserSelect(user)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{user.username}</h3>
                <p className="text-sm text-gray-500">{user.email || 'No email'}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full capitalize ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {user.createdAt && <p>Created: {formatDate(user.createdAt)}</p>}
              {user.lastLogin && <p>Last login: {formatDate(user.lastLogin)}</p>}
            </div>
          </div>
        ))}
      </div>
      {renderPagination()}
    </div>
  );
};

export default UserListComponent;
