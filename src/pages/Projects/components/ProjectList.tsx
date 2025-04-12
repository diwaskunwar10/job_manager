
import React, { useState, useEffect } from 'react';
import { Project } from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
  currentPage: number;
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onProjectSelect: (id: string) => void;
  selectedProjectId?: string;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isLoading,
  currentPage,
  meta,
  onPageChange,
  onProjectSelect,
  selectedProjectId,
  pageSizeOptions = [5, 10, 20, 50],
  onPageSizeChange
}) => {
  // State for filter and search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  
  // Animation for search placeholder
  const [placeholder, setPlaceholder] = useState('');
  const fullPlaceholder = "Search projects...";
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

  // Apply filters whenever our filter state changes
  useEffect(() => {
    let results = [...projects];

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter(project => 
        project.name.toLowerCase().includes(lowerSearch) || 
        (project.description && project.description.toLowerCase().includes(lowerSearch))
      );
    }

    // Apply date filters (using mock dates for now since project objects don't have dates)
    // In a real app, you would filter on actual project creation dates

    // Apply sorting (mock sorting by name for demonstration)
    results.sort((a, b) => {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    });

    setFilteredProjects(results);
  }, [projects, searchTerm, startDate, endDate, sortOrder]);

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

  // Generate pagination component
  const renderPagination = () => {
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(meta.totalPages, startPage + 4);

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1 && !isLoading) {
                  onPageChange(currentPage - 1);
                }
              }}
              className={currentPage === 1 || isLoading ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href="#"
                isActive={pageNum === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  if (!isLoading) {
                    onPageChange(pageNum);
                  }
                }}
                className={isLoading ? 'pointer-events-none' : ''}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < meta.totalPages && !isLoading) {
                  onPageChange(currentPage + 1);
                }
              }}
              className={currentPage === meta.totalPages || isLoading ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Projects</h2>
        <p className="text-sm text-gray-500 mt-2">
          {meta.total} projects found
        </p>
      </div>

      {/* Filter Controls */}
      <div className="p-3 bg-gray-50 rounded-lg m-3 space-y-3">
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

      <div className="flex-grow overflow-auto" style={{ height: 'calc(100% - 160px)', maxHeight: 'calc(100% - 80px)', paddingBottom: '60px' }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-t-4 border-b-4 border-brand-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p>No projects found</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredProjects.map((project) => (
              <li
                key={project._id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedProjectId === project._id ? 'bg-blue-50' : ''
                }`}
                onClick={() => onProjectSelect(project._id)}
              >
                <div className="p-4">
                  <h3 className="text-md font-medium text-gray-900">{project.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 border-t bg-white absolute bottom-0 left-0 right-0">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {onPageSizeChange && (
            <div className="w-full md:w-auto">
              <Select
                value={String(meta.pageSize)}
                onValueChange={(value) => onPageSizeChange(Number(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Page Size" />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map(size => (
                    <SelectItem key={size} value={String(size)}>{size} per page</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
