import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import UserManagementContainer from './/containers/UserManagement.container';

const UserManagementPage: React.FC = () => {
  return (
    <MainLayout>
      <UserManagementContainer />
    </MainLayout>
  );
};

export default UserManagementPage;
