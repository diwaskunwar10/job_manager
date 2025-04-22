/**
 * Jobs Filter Component
 *
 * Provides filtering controls for the jobs list, including status, verification,
 * and search filters.
 */

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { JobsFilter as JobsFilterType } from '../../../hooks/useProjectJobs';

interface JobsFilterProps {
  filter: JobsFilterType;
  onFilterChange: (filter: Partial<JobsFilterType>) => void;
}

const JobsFilter: React.FC<JobsFilterProps> = ({ filter, onFilterChange }) => {
  return (
    <div className="p-5 border-b flex-shrink-0 bg-gray-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Jobs</h2>

        <div className="w-full md:w-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Search jobs..."
              value={filter.searchQuery || ""}
              className="w-full md:w-64 rounded-lg border-gray-200 focus:ring-2 focus:ring-primary/20 transition-all"
              onChange={(e) => {
                const value = e.target.value.trim();
                onFilterChange({ searchQuery: value === "" ? undefined : value });
              }}
            />
            <Button
              variant="outline"
              className="rounded-lg bg-white hover:bg-gray-100 transition-colors"
              onClick={() => {
                onFilterChange({
                  jobStatus: undefined,
                  verified: undefined,
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

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <Select
            value={filter.jobStatus || "all"}
            onValueChange={(value) => onFilterChange({ jobStatus: value === "all" ? undefined : value as any })}
          >
            <SelectTrigger className="rounded-lg bg-white border-gray-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
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
            <SelectTrigger className="rounded-lg bg-white border-gray-200">
              <SelectValue placeholder="Verified" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Not Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default JobsFilter;
