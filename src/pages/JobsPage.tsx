
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';

const JobsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Assigned Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your assigned jobs and tasks.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">This is a placeholder for the Assigned Jobs page.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobsPage;
