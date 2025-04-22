
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, ArrowUpDown, Plus } from 'lucide-react';
import NewProjectDialog from './NewProjectDialog';
import { format } from 'date-fns';

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
  onProjectCreated?: (project: any) => void;
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
    <div className="p-4 border-b space-y-3">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder={placeholder}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onSortDirectionToggle}
          title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>

        <NewProjectDialog
          onProjectCreated={onProjectCreated}
          trigger={
            <Button variant="default" size="sm">
              <Plus className="mr-1 h-4 w-4" />
              New Project
            </Button>
          }
        />
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
              onSelect={onStartDateChange}
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
              onSelect={onEndDateChange}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={onApplyFilters}
        >
          Apply
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={onResetFilters}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
