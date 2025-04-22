/**
 * Loading State Component
 * 
 * A simple loading state component that displays a loading message.
 * Used throughout the Projects module to indicate loading states.
 */

import React from 'react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading project details...' 
}) => {
  return (
    <div className="flex items-center justify-center h-full p-6">
      <p>{message}</p>
    </div>
  );
};

export default LoadingState;
