import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchComponentProps {
  onSearch: (query: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Animated placeholder text
  const fullPlaceholder = "Search users...";
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };
  
  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    setPlaceholderIndex(fullPlaceholder.length);
  };
  
  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    if (!searchQuery) {
      setPlaceholderIndex(0);
    }
  };
  
  // Animate the placeholder text when not focused
  useEffect(() => {
    if (isFocused || searchQuery) return;
    
    const cursorInterval = setInterval(() => {
      setPlaceholderIndex(prev => {
        if (prev < fullPlaceholder.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 100); // Speed of typing animation
    
    return () => clearInterval(cursorInterval);
  }, [isFocused, searchQuery, fullPlaceholder.length]);
  
  // Reset animation after it completes
  useEffect(() => {
    if (placeholderIndex >= fullPlaceholder.length && !isFocused && !searchQuery) {
      const resetTimeout = setTimeout(() => {
        setPlaceholderIndex(0);
      }, 3000); // Wait 3 seconds before restarting animation
      
      return () => clearTimeout(resetTimeout);
    }
  }, [placeholderIndex, isFocused, searchQuery, fullPlaceholder.length]);
  
  // Current placeholder text based on animation state
  const currentPlaceholder = fullPlaceholder.substring(0, placeholderIndex);
  
  return (
    <div className="relative w-full md:w-64">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-500" />
      </div>
      <input
        ref={inputRef}
        type="text"
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        placeholder={currentPlaceholder}
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {isFocused && !searchQuery && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-0.5 bg-gray-400 animate-blink"></span>
      )}
    </div>
  );
};

export default SearchComponent;
