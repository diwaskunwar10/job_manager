
import React, { useState } from 'react';
import { Agent } from '../../../types/agent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, UserPlus, Users } from 'lucide-react';

interface AgentListProps {
  agents: Agent[];
  isLoading: boolean;
  selectedJobId?: string;
  assignedAgentIds: string[];
  onAssignAgent: (jobId: string, agentId: string) => void;
}

const AgentList: React.FC<AgentListProps> = ({
  agents,
  isLoading,
  selectedJobId,
  assignedAgentIds,
  onAssignAgent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter agents by search term
  const filteredAgents = agents.filter(agent => 
    (agent.username || agent.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (agent.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Available Agents</h3>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search agents..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex justify-between items-center space-y-2 border-b pb-4">
                <div>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-20 mt-1" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
            <Users className="h-12 w-12 mb-2" />
            <p>No agents found with your search criteria.</p>
          </div>
        ) : (
          <ul className="divide-y">
            {filteredAgents.map((agent) => {
              const isAssigned = assignedAgentIds.includes(agent._id);
              return (
                <li key={agent._id} className="flex justify-between items-center p-4 hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium">{agent.username || agent.name}</p>
                    <p className="text-xs text-gray-500">{agent.role}</p>
                    
                    {agent.status && (
                      <p className={`text-xs mt-1 ${
                        agent.status === 'available' ? 'text-green-600' : 
                        agent.status === 'busy' ? 'text-orange-600' : 'text-gray-500'
                      }`}>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!selectedJobId || isAssigned}
                    onClick={() => selectedJobId && onAssignAgent(selectedJobId, agent._id)}
                    title={isAssigned ? "Already assigned" : "Assign to job"}
                    className={isAssigned ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <UserPlus className="h-4 w-4 text-gray-500" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AgentList;
