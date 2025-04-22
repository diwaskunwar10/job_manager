
/**
 * Projects Page
 *
 * Main entry point for the Projects module. This component renders the ProjectsContainer
 * within the MainLayout. See README.md for more information about the module structure.
 */

import React from 'react';
// import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import MainLayout from '@/components/Layout/MainLayout';
import ProjectsContainer from './containers/ProjectsContainer';

const ProjectsPage: React.FC = () => {
  // We might need the slug parameter in the future
  // const { slug } = useParams<{ slug: string }>();
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
