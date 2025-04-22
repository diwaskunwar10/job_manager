import React, { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import JobListExample from './components/JobListExample';
import AgentListExample from './components/AgentListExample';

const ExamplePage: React.FC = () => {
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(undefined);
  
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Redux API Example</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <JobListExample />
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <AgentListExample selectedJobId={selectedJobId} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExamplePage;
