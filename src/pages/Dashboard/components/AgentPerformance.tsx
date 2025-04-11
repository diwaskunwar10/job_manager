
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AgentPerformanceProps {
  data: Array<{
    agent_name: string;
    calls_handled: number;
    average_handling_time: number;
    satisfaction_score: number;
  }>;
  isLoading: boolean;
}

const AgentPerformance: React.FC<AgentPerformanceProps> = ({ data, isLoading }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-medium text-gray-900">Agent Performance</h2>
      <div className="h-64">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading chart data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p>No agent performance data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agent_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="calls_handled" fill="#8884d8" name="Calls Handled" />
              <Bar dataKey="average_handling_time" fill="#82ca9d" name="Avg. Handling Time (min)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AgentPerformance;
