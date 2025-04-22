/**
 * Project Detail Component
 *
 * Displays detailed information about a selected project, including tabs for details and jobs.
 * This component is the main view for a selected project.
 */

import React, { useState } from 'react';
import { ProjectDetail as ProjectDetailType } from '../../types';
import ProjectDetailHeader from './ProjectDetailHeader';
import ProjectTabs from './ProjectTabs';
import ProjectDetailsTab from './ProjectDetailsTab';
import ProjectJobsTab from '../jobs/ProjectJobsTab';
import EmptyProjectState from '../list/EmptyProjectState';
import LoadingState from '../common/LoadingState';
import NewJobDialog from '../jobs/NewJobDialog';
import { setActiveTab } from '@/redux/slices/projectJobsNavigationSlice';
import { useAppSelector } from '@/redux/hooks';

interface ProjectDetailProps {
  project: ProjectDetailType | null;
  isLoading: boolean;
  onViewJobOutput?: (jobId: string, jobName: string) => void;
  onProjectUpdated?: (project: { _id: string; name: string }) => void;
  onProjectDeleted?: () => void;
  onJobCreated?: (job: { _id: string; name: string }) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  isLoading,
  onViewJobOutput,
  onProjectUpdated,
  onProjectDeleted,
  onJobCreated
}) => {
  // Get saved navigation state from Redux
  const savedNavigation = useAppSelector(state => state.projectJobsNavigation);

  // Initialize active tab from saved state if project ID matches
  const initialTab = (savedNavigation.projectId === project?._id) ? savedNavigation.activeTab : 'details';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isNewJobDialogOpen, setIsNewJobDialogOpen] = useState(false);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!project) {
    return <EmptyProjectState />;
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <ProjectDetailHeader
        project={project}
        onNewJobClick={() => setIsNewJobDialogOpen(true)}
        onProjectUpdated={onProjectUpdated}
        onProjectDeleted={onProjectDeleted}
      />

      <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/30">
        {activeTab === 'details' ? (
          <ProjectDetailsTab project={project} />
        ) : (
          <ProjectJobsTab
            projectId={project._id}
            onViewJobOutput={onViewJobOutput}
          />
        )}
      </div>

      <NewJobDialog
        isOpen={isNewJobDialogOpen}
        onOpenChange={setIsNewJobDialogOpen}
        projectId={project._id}
        onJobCreated={onJobCreated}
      />
    </div>
  );
};

export default ProjectDetail;
