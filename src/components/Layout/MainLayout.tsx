
import React, { Suspense, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check localStorage for sidebar state on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  // Listen for changes to localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedState = localStorage.getItem('sidebar-collapsed');
      if (savedState) {
        setIsCollapsed(savedState === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Navbar />

      <main className={`flex-1 overflow-auto transition-all duration-300 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-56'}`}>
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
