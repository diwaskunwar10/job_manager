import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { JobsFilter as JobsFilterType } from '../../types';

interface JobsFilterProps {
  filter: JobsFilterType;
  onFilterChange: (filter: Partial<JobsFilterType>) => void;
}

const JobsFilter: React.FC<JobsFilterProps> = ({ filter, onFilterChange }) => {
  return (
    <div className="p-4 border-b flex-shrink-0">
      <h2 className="text-lg font-medium mb-4">Jobs</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div>
          <Select
            value={filter.jobStatus || "all"}
            onValueChange={(value) => onFilterChange({ jobStatus: value === "all" ? undefined : value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={filter.verified !== undefined ? String(filter.verified) : "all"}
            onValueChange={(value) => onFilterChange({ verified: value === "all" ? undefined : value === "true" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Verified" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Not Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <div className="flex gap-2">
            <Input
              placeholder="Search jobs..."
              value={filter.searchQuery || ""}
              onChange={(e) => {
                const value = e.target.value.trim();
                onFilterChange({ searchQuery: value === "" ? undefined : value });
              }}
            />
            <Button
              variant="outline"
              onClick={() => {
                console.log('Resetting filters');
                onFilterChange({
                  jobStatus: undefined, // Will be converted to "all" in the Select
                  verified: undefined,  // Will be converted to "all" in the Select
                  searchQuery: "",
                  page: 1
                });
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsFilter;
