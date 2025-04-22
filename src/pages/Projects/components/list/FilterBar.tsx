/**
 * Filter Bar Component
 *
 * Provides filtering controls for the projects list, including search, sort direction,
 * date filters, and a button to create a new project.
 */

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, ArrowUpDown, Plus } from 'lucide-react';
import NewProjectDialog from './NewProjectDialog';
import { format } from 'date-fns';
import { Project } from '../../types';

interface FilterBarProps {
  searchTerm: string;
  sortDirection: 'asc' | 'desc';
  startDate: Date | undefined;
  endDate: Date | undefined;
  onSearchTermChange: (term: string) => void;
  onSortDirectionToggle: () => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onProjectCreated?: (project: Project) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  sortDirection,
  startDate,
  endDate,
  onSearchTermChange,
  onSortDirectionToggle,
  onStartDateChange,
  onEndDateChange,
  onApplyFilters,
  onResetFilters,
  onProjectCreated
}) => {
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

  return (
    <div className="p-5 border-b space-y-4 bg-gray-50/50">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            className="pl-10 py-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onSortDirectionToggle}
          title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
          className="rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>

        <NewProjectDialog
          onProjectCreated={onProjectCreated}
          trigger={
            <Button variant="default" size="sm" className="rounded-lg shadow-sm">
              <Plus className="mr-1 h-4 w-4" />
              New Project
            </Button>
          }
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs rounded-lg bg-white">
              {startDate ? format(startDate, 'PP') : 'Start Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-lg shadow-lg border-gray-200">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              initialFocus
              className="p-3 pointer-events-auto rounded-lg"
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs rounded-lg bg-white">
              {endDate ? format(endDate, 'PP') : 'End Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-lg shadow-lg border-gray-200">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              initialFocus
              className="p-3 pointer-events-auto rounded-lg"
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="sm"
          className="text-xs rounded-lg bg-white"
          onClick={onApplyFilters}
        >
          Apply
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="text-xs rounded-lg bg-white"
          onClick={onResetFilters}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
