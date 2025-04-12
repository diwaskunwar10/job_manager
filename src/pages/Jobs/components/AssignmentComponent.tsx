import React from 'react';

// Define types locally to avoid import issues
interface Job {
  _id: string;
  id: string; // Keep this for backward compatibility
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  project_id: string;
  project_name: string;
  created_at: string;
  executed_at?: string;
  completed_at?: string;
}

interface Agent {
  _id: string;
  username: string;
  role: string;
  status?: 'available' | 'busy' | 'offline';
  created_at: string;
  created_by: string;
}

interface AssignmentComponentProps {
  selectedJob: Job | null;
  selectedJobId: string | null; // Add selectedJobId as a prop
  isLoading: boolean;
  assignedAgents: Agent[];
  onAssignAgent: (jobId: string, agentId: string) => void; // Kept for API consistency
  onUnassignAgent: (jobId: string, agentId: string) => void; // For removing an agent from a job
}

const AssignmentComponent: React.FC<AssignmentComponentProps> = ({
  selectedJob,
  selectedJobId,
  isLoading,
  assignedAgents,
  // onAssignAgent, - Not used in this component
  onUnassignAgent
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Debug selectedJob
  console.log('AssignmentComponent - selectedJob:', selectedJob);

  if (!selectedJob) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Select a job to view details
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Job Details</h2>
      </div>

      {/* Job Details */}
      <div className="p-4 border-b">
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-medium">{selectedJob.name}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              selectedJob.status === 'completed' ? 'bg-green-100 text-green-800' :
              selectedJob.status === 'failed' ? 'bg-red-100 text-red-800' :
              selectedJob.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {selectedJob.status}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Project: {selectedJob.project_name}</p>
            <p className="text-sm text-gray-500">Created: {new Date(selectedJob.created_at).toLocaleString()}</p>
            {selectedJob.executed_at && (
              <p className="text-sm text-gray-500">Executed: {new Date(selectedJob.executed_at).toLocaleString()}</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium">Description</h4>
            <p className="text-sm text-gray-700 mt-1">{selectedJob.description || 'No description available'}</p>
          </div>
        </div>
      </div>

      {/* Assigned Agents */}
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium mb-2">Assigned Agents</h3>
        {assignedAgents.length === 0 ? (
          <p className="text-sm text-gray-500">No agents assigned to this job</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {assignedAgents.map((agent) => (
              <li key={agent._id} className="py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{agent.username}</p>
                    <p className="text-xs text-gray-500">{agent.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      // Use the selectedJobId prop directly
                      console.log('Unassign button clicked with job ID:', selectedJobId);
                      if (selectedJobId) {
                        onUnassignAgent(selectedJobId, agent._id);
                      } else {
                        console.error('Cannot unassign: selectedJobId is null');
                      }
                    }}
                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Assignment Instructions */}
      <div className="p-4 flex-grow">
        <div className="bg-gray-50 p-3 rounded-md">
          <h3 className="text-sm font-medium mb-2">How to Assign Agents</h3>
          <p className="text-xs text-gray-600">
            Select an agent from the list on the right and click "Assign" to assign them to this job.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssignmentComponent;
