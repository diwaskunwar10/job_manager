
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import MainLayout from '@/components/Layout/MainLayout';
import ProjectsContainer from './containers/ProjectsContainer';

const ProjectsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const tenant = useSelector((state: RootState) => state.tenant.tenant);
  
  if (!tenant) {
    return null; // Don't render until tenant is loaded
  }

  return (
    <MainLayout>
      <ProjectsContainer />
    </MainLayout>
  );
};

export default ProjectsPage;
