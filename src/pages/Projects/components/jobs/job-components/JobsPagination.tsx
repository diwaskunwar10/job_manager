/**
 * Jobs Pagination Component
 *
 * Provides pagination controls for the jobs list, including page navigation
 * and page size selection.
 */

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
import { JobsFilter } from '../../../types';

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

        <Pagination>
          <PaginationContent>
            {/* First page button */}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg bg-white border-gray-200 hover:bg-gray-50 transition-colors"
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
                className={`rounded-lg ${filter.page === 1 || isLoading ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50 transition-colors'}`}
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
                  className={`rounded-lg transition-colors ${isLoading ? 'pointer-events-none' : ''} ${pageNum === filter.page ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50'}`}
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
                className={`rounded-lg ${filter.page === totalPages || isLoading ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50 transition-colors'}`}
              />
            </PaginationItem>

            {/* Last page button */}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg bg-white border-gray-200 hover:bg-gray-50 transition-colors"
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
              className="w-20 h-8 text-sm rounded-lg border-gray-200 focus:ring-2 focus:ring-primary/20 transition-all"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="ml-1 h-8 rounded-lg bg-white border-gray-200 hover:bg-gray-50 transition-colors"
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
    <div className="p-5 border-t bg-white flex-shrink-0 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto flex items-center gap-3">

          <Select
            value={String(filter.pageSize)}
            onValueChange={(value) => onFilterChange({ pageSize: Number(value) })}
          >
            <SelectTrigger className="w-[80px] rounded-lg bg-white border-gray-200">
              <SelectValue placeholder="Items" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              {pageSizeOptions.map(size => (
                <SelectItem key={size} value={String(size)}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-600 hidden md:block">
            <span className="font-medium">{Math.min((filter.page - 1) * filter.pageSize + 1, meta.total)}-{Math.min(filter.page * filter.pageSize, meta.total)}</span>/<span className="font-medium">{meta.total}</span>
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
