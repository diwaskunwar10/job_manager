
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import JobContainer from './containers/JobContainer';
import MainLayout from '../../components/Layout/MainLayout';

const JobsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const tenant = useSelector((state: RootState) => state.tenant.tenant);
  
  if (!tenant) {
    return null; // Don't render until tenant is loaded
  }

  return (
    <MainLayout>
      <JobContainer slug={slug} tenantName={tenant.name} />
    </MainLayout>
  );
};

export default JobsPage;
