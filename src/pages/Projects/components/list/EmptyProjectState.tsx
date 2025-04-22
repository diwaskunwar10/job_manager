/**
 * Empty Project State Component
 * 
 * Displays a message when no project is selected.
 * Used in the project detail view when no project is selected.
 */

import React from 'react';

const EmptyProjectState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h3 className="text-lg font-medium text-gray-900">No Project Selected</h3>
      <p className="mt-2 text-sm text-gray-500">
        Select a project from the list to view its details.
      </p>
    </div>
  );
};

export default EmptyProjectState;
