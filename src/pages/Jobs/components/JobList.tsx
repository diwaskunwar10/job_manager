
import React, { useState } from 'react';
import JobListItem from './JobListItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface Job {
  _id: string;
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  project_name: string;
  created_at: string;
}

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  selectedJobId: string | null;
  onJobSelect: (jobId: string) => void;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading,
  selectedJobId,
  onJobSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [placeholder, setPlaceholder] = useState("");
  const fullPlaceholder = "Search jobs...";
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Animated placeholder effect
  React.useEffect(() => {
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
  React.useEffect(() => {
    if (placeholderIndex > fullPlaceholder.length) {
      const resetTimeout = setTimeout(() => {
        setPlaceholderIndex(0);
      }, 2000);
      return () => clearTimeout(resetTimeout);
    }
  }, [placeholderIndex]);

  // Apply filters whenever our filter state changes
  React.useEffect(() => {
    let results = [...jobs];

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter(job => 
        job.name.toLowerCase().includes(lowerSearch) || 
        job.project_name.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply date filters
    if (startDate) {
      results = results.filter(job => {
        const jobDate = new Date(job.created_at);
        return jobDate >= startDate;
      });
    }

    if (endDate) {
      results = results.filter(job => {
        const jobDate = new Date(job.created_at);
        return jobDate <= endDate;
      });
    }

    // Apply sorting
    results.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredJobs(results);
  }, [jobs, searchTerm, startDate, endDate, sortOrder]);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStartDate(undefined);
    setEndDate(undefined);
    setSortOrder('desc');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        No jobs found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter section */}
      <div className="p-3 bg-gray-50 rounded-lg space-y-3">
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
            onClick={toggleSortOrder}
            title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                {startDate ? format(startDate, 'PP') : 'Start Date'}
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
              <Button variant="outline" size="sm" className="text-xs">
                {endDate ? format(endDate, 'PP') : 'End Date'}
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
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={resetFilters}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Jobs list */}
      <ul className="divide-y divide-gray-200">
        {filteredJobs.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No jobs match your filters
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobListItem 
              key={job._id}
              job={job}
              isSelected={selectedJobId === job._id}
              onSelect={onJobSelect}
            />
          ))
        )}
      </ul>
    </div>
  );
};

export default JobList;
