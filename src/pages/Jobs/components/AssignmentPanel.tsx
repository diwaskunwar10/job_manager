
import React from 'react';
import { Job } from '../../../types/job';
import { Agent } from '../../../types/agent';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Eye, Users, X } from 'lucide-react';

interface AssignmentPanelProps {
  selectedJob: Job | null;
  isLoading: boolean;
  assignedAgents: Agent[];
  onUnassignAgent: (jobId: string, agentId: string) => void;
  onViewOutput: (jobId: string) => void;
}

const AssignmentPanel: React.FC<AssignmentPanelProps> = ({
  selectedJob,
  isLoading,
  assignedAgents,
  onUnassignAgent,
  onViewOutput
}) => {
  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default: // pending
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  // Format status for display
  const getFormattedStatus = (status: string) => {
    if (status === 'in_progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Job Assignment</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!selectedJob ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <Users className="h-12 w-12 mb-2" />
            <p>Select a job to view and manage assigned agents</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Job Details */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-lg">{selectedJob.name}</h4>
              
              {selectedJob.description && (
                <p className="text-gray-600 text-sm mt-1">{selectedJob.description}</p>
              )}
              
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span 
                    className={`ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeClass(selectedJob.status)}`}
                  >
                    {getFormattedStatus(selectedJob.status)}
                  </span>
                </div>
                
                {selectedJob.project_name && (
                  <div>
                    <span className="text-gray-500">Project:</span>
                    <span className="ml-1">{selectedJob.project_name}</span>
                  </div>
                )}
                
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-1">{format(new Date(selectedJob.created_at), 'MMM d, yyyy')}</span>
                </div>
                
                {selectedJob.executed_at && (
                  <div>
                    <span className="text-gray-500">Executed:</span>
                    <span className="ml-1">{format(new Date(selectedJob.executed_at), 'MMM d, yyyy')}</span>
                  </div>
                )}
                
                {selectedJob.completed_at && (
                  <div>
                    <span className="text-gray-500">Completed:</span>
                    <span className="ml-1">{format(new Date(selectedJob.completed_at), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => onViewOutput(selectedJob._id)}
              >
                <Eye className="h-4 w-4 mr-2" /> View Job Output
              </Button>
            </div>
            
            {/* Assigned Agents */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Agents ({assignedAgents.length})</h4>
              
              {assignedAgents.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-center text-gray-500">
                  No agents assigned to this job yet.
                </div>
              ) : (
                <ul className="divide-y border rounded-lg overflow-hidden">
                  {assignedAgents.map((agent) => (
                    <li key={agent._id} className="flex justify-between items-center p-3 hover:bg-gray-50">
                      <div>
                        <p className="text-sm font-medium">{agent.username || agent.name}</p>
                        <p className="text-xs text-gray-500">{agent.role}</p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUnassignAgent(selectedJob._id, agent._id)}
                        title="Remove agent from job"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentPanel;
