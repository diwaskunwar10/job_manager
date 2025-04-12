import apiRequest, { ApiCallbacks } from '../utils/httpClient';
import { USERS } from '../constants/apiEndpoints';

export interface User {
  _id: string;
  username: string;
  role: string;
  tenant_id: string;
  email?: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface UsersResponse {
  current_page: number;
  total_pages: number;
  total_documents: number;
  documents: User[];
}

// Get subordinate users with pagination and search
export const getSubordinateUsers = async (
  pageNumber: number = 1,
  documentsPerPage: number = 12,
  searchQuery: string = '',
  callbacks?: ApiCallbacks
) => {
  return apiRequest({
    url: USERS.GET_SUBORDINATES,
    method: 'GET',
    params: {
      page_number: pageNumber,
      documents_per_page: documentsPerPage,
      agent_search_query: searchQuery
    },
    callbacks
  });
};

// Change user role
export const changeUserRole = async (
  userId: string,
  role: 'admin' | 'user' | 'manager',
  callbacks?: ApiCallbacks
) => {
  return apiRequest({
    url: USERS.CHANGE_ROLE,
    method: 'POST',
    data: {
      id: userId,
      role
    },
    callbacks
  });
};

// Reset user password
export const resetUserPassword = async (
  userId: string,
  callbacks?: ApiCallbacks
) => {
  return apiRequest({
    url: USERS.RESET_PASSWORD,
    method: 'POST',
    data: {
      user_id: userId
    },
    callbacks
  });
};

// Change password
export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
  callbacks?: ApiCallbacks
) => {
  return apiRequest({
    url: USERS.CHANGE_PASSWORD,
    method: 'POST',
    data: {
      user_id: userId,
      old_password: oldPassword,
      new_password: newPassword
    },
    callbacks
  });
};

// Delete user
export const deleteUser = async (
  userId: string,
  callbacks?: ApiCallbacks
) => {
  return apiRequest({
    url: USERS.DELETE_USER,
    method: 'POST',
    data: {
      user_id: userId
    },
    callbacks
  });
};

// Invite user
export const inviteUser = async (
  email: string,
  role: 'admin' | 'user' | 'manager',
  callbacks?: ApiCallbacks
) => {
  return apiRequest({
    url: USERS.INVITE_USER,
    method: 'POST',
    data: {
      email,
      role
    },
    callbacks
  });
};

// Export all functions as a service object
export const userService = {
  getSubordinateUsers,
  changeUserRole,
  resetUserPassword,
  changePassword,
  deleteUser,
  inviteUser
};

export default userService;
