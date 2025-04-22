/**
 * Project Tabs Component
 *
 * Provides tab navigation for the project detail view, allowing users to switch
 * between the Details and Jobs tabs.
 */

import React from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setActiveTab } from '@/redux/slices/projectJobsNavigationSlice';

interface ProjectTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ activeTab, onTabChange }) => {
  const dispatch = useAppDispatch();

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    dispatch(setActiveTab(tab));
  };

  return (
    <div className="px-6 flex-shrink-0 bg-white">
      <div className="flex space-x-6 border-b">
        <button
          className={`px-5 py-3 text-sm font-medium transition-all relative ${activeTab === 'details' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={(e) => {
            e.preventDefault();
            handleTabChange('details');
          }}
        >
          Details
          {activeTab === 'details' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
          )}
        </button>
        <button
          className={`px-5 py-3 text-sm font-medium transition-all relative ${activeTab === 'jobs' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={(e) => {
            e.preventDefault();
            handleTabChange('jobs');
          }}
        >
          Jobs
          {activeTab === 'jobs' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProjectTabs;
