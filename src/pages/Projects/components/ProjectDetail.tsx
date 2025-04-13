
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

interface ProjectDetailProps {
  project: ProjectDetailType | null;
  isLoading: boolean;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, isLoading }) => {
  const [activeTab, setActiveTab] = useState('details');
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
      />
      
      <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'details' ? (
          <ProjectDetailsTab project={project} />
        ) : (
          <ProjectJobsTab projectId={project._id} />
        )}
      </div>

      <NewJobDialog 
        isOpen={isNewJobDialogOpen} 
        onOpenChange={setIsNewJobDialogOpen}
        projectId={project._id}
      />
    </div>
  );
};

export default ProjectDetail;
