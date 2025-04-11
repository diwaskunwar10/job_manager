
import React from 'react';

interface DateRangeSelectorProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  setDateRange: React.Dispatch<React.SetStateAction<{
    startDate: string;
    endDate: string;
  }>>;
  onUpdate: () => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ 
  dateRange, 
  setDateRange,
  onUpdate 
}) => {
  return (
    <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <input
        type="date"
        value={dateRange.startDate}
        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
      />
      <input
        type="date"
        value={dateRange.endDate}
        onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
      />
      <button
        onClick={onUpdate}
        className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700"
      >
        Update
      </button>
    </div>
  );
};

export default DateRangeSelector;
