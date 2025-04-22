
import React, { useState, useEffect } from 'react';
import { ProjectDetail as ProjectDetailType } from '@/services/projectService';
import ProjectDetailHeader from './ProjectDetailHeader';
import ProjectTabs from './ProjectTabs';
import ProjectDetailsTab from './ProjectDetailsTab';
import ProjectJobsTab from './ProjectJobsTab';
import EmptyProjectState from './EmptyProjectState';
import LoadingState from './LoadingState';
import NewJobDialog from './NewJobDialog';
import { useProjectJobs } from '../hooks/useProjectJobs';
import { useAppSelector } from '@/redux/hooks';

interface ProjectDetailProps {
  project: ProjectDetailType | null;
  isLoading: boolean;
  onViewJobOutput?: (jobId: string, jobName: string) => void;
  onProjectUpdated?: (project: any) => void;
  onProjectDeleted?: () => void;
  onJobCreated?: (job: any) => void;
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
    <div className="h-full flex flex-col">
      <ProjectDetailHeader
        project={project}
        onNewJobClick={() => setIsNewJobDialogOpen(true)}
        onProjectUpdated={onProjectUpdated}
        onProjectDeleted={onProjectDeleted}
      />

      <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
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
