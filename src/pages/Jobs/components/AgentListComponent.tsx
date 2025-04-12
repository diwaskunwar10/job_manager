import React from 'react';

// Define Agent type locally to avoid import issues
interface Agent {
  _id: string;
  username: string;
  role: string;
  created_at: string;
  status?: 'available' | 'busy' | 'offline';
  created_by: string;
}

interface AgentListComponentProps {
  agents: Agent[];
  isLoading: boolean;
  selectedJobId: string | null;
  assignedAgentIds: string[];
  onAssignAgent: (jobId: string, agentId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const AgentListComponent: React.FC<AgentListComponentProps> = ({
  agents,
  isLoading,
  selectedJobId,
  assignedAgentIds,
  onAssignAgent,
  currentPage,
  totalPages, // Not used, we calculate actualTotalPages based on agents.length
  onPageChange,
  onPageSizeChange
}) => {
  // Default page size
  const pageSize = 10;

  // Calculate actual total pages based on the number of agents
  const actualTotalPages = Math.max(1, Math.ceil(agents.length / pageSize));
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Agents</h2>
      </div>

      {/* Agent List */}
      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : agents.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No agents found
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {/* Apply client-side pagination */}
            {agents
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((agent) => {
              const isAssigned = assignedAgentIds.includes(agent._id);

              return (
                <li key={agent._id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{agent.username}</div>
                      <div className="text-sm text-gray-500">{agent.role}</div>
                      {agent.status && (
                        <div className={`text-xs ${
                          agent.status === 'available' ? 'text-green-600' :
                          agent.status === 'busy' ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {agent.status}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (selectedJobId && !isAssigned) {
                          onAssignAgent(selectedJobId, agent._id);
                        }
                      }}
                      disabled={!selectedJobId || isAssigned}
                      className={`inline-flex items-center px-3 py-1 border text-sm font-medium rounded-md ${
                        !selectedJobId
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                          : isAssigned
                            ? 'bg-green-100 text-green-800 border-green-300 cursor-not-allowed'
                            : 'bg-indigo-100 text-indigo-700 border-indigo-300 hover:bg-indigo-200'
                      }`}
                    >
                      {isAssigned ? 'Assigned' : 'Assign'}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {actualTotalPages}
            </span>
            <select
              className="ml-2 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              defaultValue={10}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === actualTotalPages}
              className={`inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === actualTotalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentListComponent;
