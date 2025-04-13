
import React from 'react';

interface ProjectTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b px-6 flex-shrink-0">
      <div className="flex space-x-2 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={(e) => {
            e.preventDefault();
            console.log('Details tab clicked');
            onTabChange('details');
          }}
        >
          Details
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'jobs' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={(e) => {
            e.preventDefault();
            console.log('Jobs tab clicked, using custom handler');
            onTabChange('jobs');
          }}
        >
          Jobs
        </button>
      </div>
    </div>
  );
};

export default ProjectTabs;
