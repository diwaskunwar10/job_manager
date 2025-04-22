import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { 
  getAllAgentsApi, 
  assignAgentToJobApi, 
  removeAgentFromJobApi 
} from '../../../redux/slices/agentsSlice.new';
import { Agent } from '../../../types/agent';

interface AgentListExampleProps {
  selectedJobId?: string;
}

const AgentListExample: React.FC<AgentListExampleProps> = ({ selectedJobId }) => {
  const dispatch = useAppDispatch();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [assignedAgents, setAssignedAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents();
  }, []);
  
  // Fetch agents with the callback pattern
  const fetchAgents = () => {
    setIsLoading(true);
    
    dispatch(
      getAllAgentsApi({
        finalCallback: () => {
          setIsLoading(false);
        },
        successCallback: (response) => {
          if (Array.isArray(response)) {
            setAgents(response);
          } else if (response.agents && Array.isArray(response.agents)) {
            setAgents(response.agents);
          } else {
            setAgents([]);
          }
          setError(null);
        },
        failureCallback: (error) => {
          setError(error instanceof Error ? error.message : 'An unknown error occurred');
        },
      })
    );
  };
  
  // Assign agent to job
  const handleAssignAgent = (agentId: string) => {
    if (!selectedJobId) {
      setError('No job selected');
      return;
    }
    
    setIsLoading(true);
    
    dispatch(
      assignAgentToJobApi({
        additionalParams: { jobId: selectedJobId, agentId },
        params: {
          agent_id: agentId
        },
        finalCallback: () => {
          setIsLoading(false);
        },
        successCallback: () => {
          // Add the agent to the assigned agents list
          const agentToAssign = agents.find(a => a._id === agentId);
          if (agentToAssign && !assignedAgents.some(a => a._id === agentId)) {
            setAssignedAgents([...assignedAgents, agentToAssign]);
          }
          setError(null);
        },
        failureCallback: (error) => {
          setError(error instanceof Error ? error.message : 'An unknown error occurred');
        },
      })
    );
  };
  
  // Unassign agent from job
  const handleUnassignAgent = (agentId: string) => {
    if (!selectedJobId) {
      setError('No job selected');
      return;
    }
    
    setIsLoading(true);
    
    dispatch(
      removeAgentFromJobApi({
        additionalParams: { jobId: selectedJobId, agentId },
        finalCallback: () => {
          setIsLoading(false);
        },
        successCallback: () => {
          // Remove the agent from the assigned agents list
          setAssignedAgents(assignedAgents.filter(a => a._id !== agentId));
          setError(null);
        },
        failureCallback: (error) => {
          setError(error instanceof Error ? error.message : 'An unknown error occurred');
        },
      })
    );
  };
  
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Agents List Example</h2>
      
      {isLoading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Available Agents</h3>
              {agents.length > 0 ? (
                <div className="space-y-2">
                  {agents
                    .filter(agent => !assignedAgents.some(a => a._id === agent._id))
                    .map(agent => (
                      <div key={agent._id} className="p-3 border rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{agent.username}</p>
                            <p className="text-xs text-gray-500">{agent.role}</p>
                          </div>
                          <button
                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded disabled:opacity-50"
                            disabled={!selectedJobId}
                            onClick={() => handleAssignAgent(agent._id)}
                          >
                            Assign
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No agents available</div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Assigned Agents</h3>
              {assignedAgents.length > 0 ? (
                <div className="space-y-2">
                  {assignedAgents.map(agent => (
                    <div key={agent._id} className="p-3 border rounded bg-blue-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{agent.username}</p>
                          <p className="text-xs text-gray-500">{agent.role}</p>
                        </div>
                        <button
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                          onClick={() => handleUnassignAgent(agent._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No agents assigned</div>
              )}
            </div>
          </div>
          
          {!selectedJobId && (
            <div className="p-3 bg-yellow-100 text-yellow-800 rounded">
              Select a job to assign agents
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AgentListExample;
