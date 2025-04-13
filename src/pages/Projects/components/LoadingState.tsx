
import React from 'react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading project details...' }) => {
  return (
    <div className="flex items-center justify-center h-full p-6">
      <p>{message}</p>
    </div>
  );
};

export default LoadingState;
