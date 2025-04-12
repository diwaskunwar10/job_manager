
import React from 'react';

interface JobFilterPanelProps {
  statusFilter: 'assigned' | 'unassigned' | 'all';
  projectFilter: string;
  createdAtStart: string;
  createdAtEnd: string;
  executedAtStart: string;
  executedAtEnd: string;
  onStatusFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onProjectFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCreatedAtStartChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreatedAtEndChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExecutedAtStartChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExecutedAtEndChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

const JobFilterPanel: React.FC<JobFilterPanelProps> = ({
  statusFilter,
  projectFilter,
  createdAtStart,
  createdAtEnd,
  executedAtStart,
  executedAtEnd,
  onStatusFilterChange,
  onProjectFilterChange,
  onCreatedAtStartChange,
  onCreatedAtEndChange,
  onExecutedAtStartChange,
  onExecutedAtEndChange,
  applyFilters,
  resetFilters
}) => {
  return (
    <div className="p-4 border-b space-y-3">
      <h3 className="text-sm font-medium">Filters</h3>

      {/* Status Filter */}
      <div>
        <label className="block text-sm text-gray-700">Status</label>
        <select
          value={statusFilter}
          onChange={onStatusFilterChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">All</option>
          <option value="assigned">Assigned</option>
          <option value="unassigned">Unassigned</option>
        </select>
      </div>

      {/* Project Filter */}
      <div>
        <label className="block text-sm text-gray-700">Project</label>
        <select
          value={projectFilter}
          onChange={onProjectFilterChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Projects</option>
          {/* Project options would be dynamically populated */}
          <option value="project1">Project 1</option>
          <option value="project2">Project 2</option>
        </select>
      </div>

      {/* Created At Filter */}
      <div>
        <label className="block text-sm text-gray-700">Created At</label>
        <div className="flex space-x-2">
          <input
            type="date"
            value={createdAtStart}
            onChange={onCreatedAtStartChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="From"
          />
          <input
            type="date"
            value={createdAtEnd}
            onChange={onCreatedAtEndChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="To"
          />
        </div>
      </div>

      {/* Executed At Filter */}
      <div>
        <label className="block text-sm text-gray-700">Executed At</label>
        <div className="flex space-x-2">
          <input
            type="date"
            value={executedAtStart}
            onChange={onExecutedAtStartChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="From"
          />
          <input
            type="date"
            value={executedAtEnd}
            onChange={onExecutedAtEndChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="To"
          />
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex space-x-2">
        <button
          onClick={applyFilters}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default JobFilterPanel;
