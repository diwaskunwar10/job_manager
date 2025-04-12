import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Search, Plus, ArrowUpDown } from 'lucide-react';
import JobListComponent from './components/JobListComponent';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface JobComponentProps {
  tenantName: string;
}

const JobComponent: React.FC<JobComponentProps> = ({ tenantName }) => {
  // State for filter/sort
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Animation for search placeholder
  const [placeholder, setPlaceholder] = useState('');
  const fullPlaceholder = "Search jobs...";
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  // Job list state
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Mock function to fetch jobs - would be replaced with actual API call
  const fetchJobs = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setJobs([
        { 
          _id: '1', 
          id: '1', 
          name: 'Job 1', 
          status: 'pending', 
          project_id: '1', 
          project_name: 'Project 1',
          created_at: '2023-04-01T00:00:00.000Z'
        },
        { 
          _id: '2', 
          id: '2', 
          name: 'Job 2', 
          status: 'completed', 
          project_id: '2', 
          project_name: 'Project 2',
          created_at: '2023-04-02T00:00:00.000Z'
        }
      ]);
      setTotalPages(1);
      setIsLoading(false);
    }, 500);
  };

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
  
  // Initial load
  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle job selection
  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Would call API with new page
    fetchJobs();
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    // Would reset to page 1 and call API with new size
    setCurrentPage(1);
    fetchJobs();
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Filter jobs
  const filterJobs = () => {
    // Would call API with filters
    fetchJobs();
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStartDate(undefined);
    setEndDate(undefined);
    fetchJobs();
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all jobs for {tenantName}.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-150px)]" style={{ minHeight: '600px' }}>
          {/* Jobs List - Left Side */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
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
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm">
                      <Plus className="mr-1 h-4 w-4" />
                      New Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Job</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      {/* Job creation form would go here */}
                      <p className="text-sm text-gray-500">Job creation form placeholder</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="flex space-x-2">
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
                  onClick={filterJobs}
                >
                  Apply
                </Button>
                
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
            
            {/* Job List */}
            <JobListComponent
              jobs={jobs}
              isLoading={isLoading}
              onJobSelect={handleJobSelect}
              selectedJobId={selectedJobId}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
          
          {/* Job Detail - Right Side */}
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md overflow-hidden">
            {selectedJobId ? (
              <div className="p-4">
                <h2 className="text-xl font-semibold">Job Detail</h2>
                <p className="text-gray-500 mt-2">Selected Job ID: {selectedJobId}</p>
                {/* Job details would go here */}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a job to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobComponent;
