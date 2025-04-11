
import React from 'react';

interface SupervisorAssignmentsProps {
  data: Array<{
    supervisor_name: string;
    team_size: number;
    active_projects: number;
    completion_rate: number;
  }>;
  isLoading: boolean;
}

const SupervisorAssignments: React.FC<SupervisorAssignmentsProps> = ({ data, isLoading }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md lg:col-span-2 xl:col-span-1">
      <h2 className="mb-4 text-lg font-medium text-gray-900">Supervisor Assignments</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">Supervisor</th>
              <th className="px-4 py-3">Team Size</th>
              <th className="px-4 py-3">Active Projects</th>
              <th className="px-4 py-3">Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-3 text-center">Loading data...</td>
              </tr>
            ) : (
              data.map((supervisor, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {supervisor.supervisor_name}
                  </td>
                  <td className="px-4 py-3">{supervisor.team_size}</td>
                  <td className="px-4 py-3">{supervisor.active_projects}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className="mr-2">{supervisor.completion_rate}%</span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${supervisor.completion_rate}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupervisorAssignments;
