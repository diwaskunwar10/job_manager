import { lazy } from "react";

// Loading fallback component
export const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-16 h-16 border-t-4 border-b-4 border-brand-600 rounded-full animate-spin"></div>
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  </div>
);

// Lazy load pages for better performance
export const TenantSlugPage = lazy(() => import("../pages/TenantSlugPage"));
export const LoginPage = lazy(() => import("../pages/Login"));
export const LogoutPage = lazy(() => import("../pages/Logout"));
// Alias for compatibility with existing code
export const xLogoutPage = LogoutPage;
export const NotFoundPage = lazy(() => import("../pages/NotFound"));
export const Dashboard = lazy(() => import("../pages/Dashboard"));
export const ProjectsPage = lazy(() => import("../pages/Projects"));
export const UserManagementPage = lazy(() => import("../pages/UserManagement"));
