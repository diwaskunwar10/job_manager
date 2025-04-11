
import React from 'react';
import DateRangeSelector from './DateRangeSelector';

interface DashboardHeaderProps {
  tenantName: string;
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

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  tenantName, 
  dateRange, 
  setDateRange, 
  onUpdate 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to {tenantName}'s performance dashboard. View key metrics and statistics.
        </p>
      </div>
      
      <DateRangeSelector 
        dateRange={dateRange}
        setDateRange={setDateRange}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default DashboardHeader;
