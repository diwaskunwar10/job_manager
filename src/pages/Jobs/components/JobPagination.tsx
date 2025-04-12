
import React from 'react';

interface JobPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const JobPagination: React.FC<JobPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange
}) => {
  return (
    <div className="p-4 border-t">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
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
            disabled={currentPage === totalPages}
            className={`inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPagination;
