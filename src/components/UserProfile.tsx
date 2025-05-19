import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const {
    user,
    isAuthenticated,
    getUserRole,
    getTenantLabel,
    logoutUser
  } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate to logout page
    navigate(`/${user?.tenant_slug || ''}/logout`);
  };

  if (!isAuthenticated || !user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user.username}</h2>
          <p className="text-gray-600">{getUserRole()}</p>
          <p className="text-sm text-gray-500">Tenant: {getTenantLabel()}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
