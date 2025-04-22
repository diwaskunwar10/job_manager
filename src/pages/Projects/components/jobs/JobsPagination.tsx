import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { JobsFilter } from '../../hooks/useProjectJobs';

interface JobsPaginationProps {
  filter: JobsFilter;
  meta: {
    total: number;
    page: number;
    page_size: number;
  };
  isLoading: boolean;
  onFilterChange: (filter: Partial<JobsFilter>) => void;
  pageSizeOptions: number[];
}

const JobsPagination: React.FC<JobsPaginationProps> = ({
  filter,
  meta,
  isLoading,
  onFilterChange,
  pageSizeOptions
}) => {
  // Calculate total pages
  const totalPages = Math.ceil(meta.total / meta.page_size);

  // State for page input
  const [pageInputValue, setPageInputValue] = useState<string>('');

  // Handle direct page navigation
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPageInputValue(value);
  };

  // Handle page input submission
  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(pageInputValue, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages && !isLoading) {
      onFilterChange({ page: pageNumber });
      setPageInputValue('');
    }
  };

  // Generate pagination component
  const renderPagination = () => {
    // For smaller screens or when there are many pages, show fewer page numbers
    const maxVisiblePages = 3; // Adjust based on screen size if needed
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, filter.page - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="text-sm text-gray-500 mb-2 sm:mb-0">
          Page {filter.page} of {totalPages}
        </div>

        <Pagination>
          <PaginationContent>
            {/* First page button */}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={filter.page === 1 || isLoading}
                onClick={() => {
                  if (filter.page !== 1 && !isLoading) {
                    onFilterChange({ page: 1 });
                  }
                }}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
            </PaginationItem>

            {/* Previous button */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (filter.page > 1 && !isLoading) {
                    onFilterChange({ page: Math.max(1, filter.page - 1) });
                  }
                }}
                className={filter.page === 1 || isLoading ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {/* Page numbers */}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href="#"
                  isActive={pageNum === filter.page}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isLoading) {
                      onFilterChange({ page: pageNum });
                    }
                  }}
                  className={isLoading ? 'pointer-events-none' : ''}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Next button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (filter.page < totalPages && !isLoading) {
                    onFilterChange({ page: Math.min(totalPages, filter.page + 1) });
                  }
                }}
                className={filter.page === totalPages || isLoading ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {/* Last page button */}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={filter.page === totalPages || isLoading}
                onClick={() => {
                  if (filter.page !== totalPages && !isLoading) {
                    onFilterChange({ page: totalPages });
                  }
                }}
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Page input form */}
        <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2 ml-2">
          <div className="flex items-center">
            <Input
              type="text"
              value={pageInputValue}
              onChange={handlePageInputChange}
              placeholder="Go to page"
              className="w-20 h-8 text-sm"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="ml-1 h-8"
              disabled={isLoading || !pageInputValue}
            >
              Go
            </Button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="p-4 border-t bg-white flex-shrink-0">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="text-sm text-gray-500">Show:</div>
          <Select
            value={String(filter.pageSize)}
            onValueChange={(value) => onFilterChange({ pageSize: Number(value) })}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Page Size" />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(size => (
                <SelectItem key={size} value={String(size)}>{size} per page</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-500 hidden md:block">
            Showing {Math.min((filter.page - 1) * filter.pageSize + 1, meta.total)} - {Math.min(filter.page * filter.pageSize, meta.total)} of {meta.total} items
          </div>
        </div>
        <div className="w-full md:w-auto">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default JobsPagination;
