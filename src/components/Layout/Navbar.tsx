
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { state, logoutUser } = useAppContext();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

  // If tenant not set, don't show navbar
  if (!state.tenant) {
    return null;
  }

  const menuItems = [
    {
      name: 'Dashboard',
      path: `/${state.tenant.slug}/dashboard`,
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Projects',
      path: `/${state.tenant.slug}/projects`,
      icon: <FolderKanban className="w-5 h-5" />
    },
    {
      name: 'Assigned Jobs',
      path: `/${state.tenant.slug}/jobs`,
      icon: <ClipboardList className="w-5 h-5" />
    },
    {
      name: 'User Management',
      path: `/${state.tenant.slug}/users`,
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-white"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Collapse toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex fixed bottom-4 left-4 z-40 p-2 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Toggle sidebar collapse"
      >
        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 z-30 ${isCollapsed ? 'lg:w-16' : 'lg:w-56'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Top section - Project info */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
              {state.tenant.name.charAt(0)}
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-gray-800">{state.tenant.name}</h2>
                <p className="text-xs text-gray-500">{state.tenant.slug}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} py-3 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'text-brand-700 bg-brand-50 border-r-4 border-brand-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title={isCollapsed ? item.name : ''}
                >
                  {item.icon}
                  {!isCollapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logoutUser}
            className={`flex ${isCollapsed ? 'justify-center w-auto' : 'w-full'} items-center ${isCollapsed ? '' : 'px-4'} py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default Navbar;
