
import React, { Suspense } from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Navbar />
      
      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8 min-h-screen">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <div className="animate-fade-in">
              {children}
            </div>
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
