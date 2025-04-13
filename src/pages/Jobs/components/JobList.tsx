
import React, { useState, useEffect } from 'react';
import { Job } from '../../../types/job';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  ArrowUpDown, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import JobListItem from './JobListItem';
import JobPagination from './JobPagination';
import { JobsFilter } from '../../../redux/slices/jobsSlice';

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  selectedJobId?: string;
  currentPage: number;
  totalPages: number;
  onJobSelect: (jobId: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onFilterChange: (filter: Partial<JobsFilter>) => void;
  onViewOutput: (jobId: string) => void;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading,
  selectedJobId,
  currentPage,
  totalPages,
  onJobSelect,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  onViewOutput
}) => {
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Animation for search placeholder
  const [placeholder, setPlaceholder] = useState('');
  const fullPlaceholder = "Search jobs...";
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Animated placeholder effect
  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (placeholderIndex <= fullPlaceholder.length) {
        setPlaceholder(fullPlaceholder.substring(0, placeholderIndex));
        setPlaceholderIndex(prev => prev + 1);
      } else {
        clearInterval(typingInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, [placeholderIndex]);

  // Reset animation after it completes
  useEffect(() => {
    if (placeholderIndex > fullPlaceholder.length) {
      const resetTimeout = setTimeout(() => {
        setPlaceholderIndex(0);
      }, 2000);
      return () => clearTimeout(resetTimeout);
    }
  }, [placeholderIndex]);

  // Apply filters
  const applyFilters = () => {
    const newFilter: Partial<JobsFilter> = {};
    
    if (searchTerm) {
      newFilter.searchQuery = searchTerm;
    }
    
    if (statusFilter !== 'all') {
      newFilter.jobStatus = statusFilter as any;
    }
    
    if (verifiedFilter !== 'all') {
      newFilter.verified = verifiedFilter === 'verified';
    }
    
    if (startDate) {
      newFilter.created_at_start = format(startDate, 'yyyy-MM-dd');
    }
    
    if (endDate) {
      newFilter.created_at_end = format(endDate, 'yyyy-MM-dd');
    }
    
    onFilterChange(newFilter);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setVerifiedFilter('all');
    setStartDate(undefined);
    setEndDate(undefined);
    onFilterChange({});
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    onFilterChange({ sort_direction: newDirection });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filter Controls */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder={placeholder}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortDirection}
            title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue placeholder="Verified" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                {startDate ? format(startDate, 'PP') : 'Start Date'}
                <CalendarIcon className="ml-2 h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                {endDate ? format(endDate, 'PP') : 'End Date'}
                <CalendarIcon className="ml-2 h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={applyFilters}
            >
              <CheckSquare className="mr-1 h-3 w-3" /> Apply
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={resetFilters}
            >
              <X className="mr-1 h-3 w-3" /> Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="space-y-2 border-b pb-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-gray-500">No jobs found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="divide-y">
            {jobs.map((job) => (
              <JobListItem
                key={job._id}
                job={job}
                isSelected={job._id === selectedJobId}
                onSelect={() => onJobSelect(job._id)}
                onViewOutput={() => onViewOutput(job._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="border-t p-4">
        <JobPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
};

export default JobList;
