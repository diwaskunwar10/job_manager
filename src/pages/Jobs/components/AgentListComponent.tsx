import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

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

  // Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>(agents);

  // Animated placeholder states
  const [placeholder, setPlaceholder] = useState('');
  const fullPlaceholder = "Search agents...";
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Calculate actual total pages based on the number of filtered agents
  const actualTotalPages = Math.max(1, Math.ceil(filteredAgents.length / pageSize));

  // Filter agents when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredAgents(agents);
    } else {
      const filtered = agents.filter(agent =>
        agent.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAgents(filtered);
    }
  }, [agents, searchQuery]);

  // Animated placeholder effect
  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (placeholderIndex <= fullPlaceholder.length) {
        setPlaceholder(fullPlaceholder.substring(0, placeholderIndex));
        setPlaceholderIndex(prev => prev + 1);
      } else {
        clearInterval(typingInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, [placeholderIndex, fullPlaceholder]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Reset animation after it completes
  useEffect(() => {
    if (placeholderIndex > fullPlaceholder.length) {
      const resetTimeout = setTimeout(() => {
        setPlaceholderIndex(0);
      }, 2000);
      return () => clearTimeout(resetTimeout);
    }
  }, [placeholderIndex, fullPlaceholder]);
  return (
    <div className="flex flex-col h-full">
      {/* Header with Search */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Agents</h2>
        </div>

        {/* Search Bar with Animation */}
        <div className="relative">
          <div className={`relative transition-all duration-300 ease-in-out transform ${searchFocused ? 'scale-105 -translate-y-0.5' : 'scale-100'}`}>
            <input
              type="text"
              placeholder={`${placeholder}${showCursor && placeholderIndex <= fullPlaceholder.length ? '|' : ''}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setSearchFocused(true);
                // Stop the placeholder animation when focused
                setPlaceholderIndex(fullPlaceholder.length + 1);
              }}
              onBlur={() => setSearchFocused(false)}
              className={`pl-10 pr-4 py-2 w-full rounded-md border ${searchFocused ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-200' : 'border-gray-300 shadow-sm'} outline-none transition-all duration-300`}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                className={`h-5 w-5 transition-all duration-300 ${searchFocused ? 'text-indigo-500 scale-110' : 'text-gray-400 animate-pulse-slow'}`}
                style={{
                  transform: searchFocused ? 'translateX(-2px) rotate(-5deg)' : 'translateX(0) rotate(0deg)',
                  transition: 'transform 0.3s ease-in-out'
                }}
              />
            </div>
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
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
            {filteredAgents
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