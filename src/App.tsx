
import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { setupGlobalAuthErrorHandler } from "./utils/authErrorHandler";
import { useAppDispatch } from "./redux/hooks";
import { checkAuthStatus } from "./redux/actions/authActions";

// Lazy load pages for better performance
const TenantSlugPage = lazy(() => import("./pages/TenantSlugPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectsPage = lazy(() => import("./pages/Projects"));
const JobsPage = lazy(() => import("./pages/Jobs"));
const JobOutputPage = lazy(() => import("./pages/Jobs/JobOutput"));
const UserManagementPage = lazy(() => import("./pages/UserManagement"));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-16 h-16 border-t-4 border-b-4 border-brand-600 rounded-full animate-spin"></div>
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  </div>
);

const App = () => {
  const dispatch = useAppDispatch();

  // Check authentication status on mount
  useEffect(() => {
    // Set up global auth error handler
    setupGlobalAuthErrorHandler();

    // Check authentication status
    dispatch(checkAuthStatus() as any);
  }, [dispatch]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Index route - redirect to 404 if accessed directly */}
        <Route path="/" element={<Navigate to="/404" />} />

        {/* Public routes */}
        <Route path="/:slug" element={<TenantSlugPage />} />
        <Route path="/:slug/login" element={<LoginPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* Protected routes */}
        <Route path="/:slug/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/:slug/projects" element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        } />
        <Route path="/:slug/projects/:projectId" element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        } />
        <Route path="/:slug/jobs" element={
          <ProtectedRoute>
            <JobsPage />
          </ProtectedRoute>
        } />
        <Route path="/:slug/jobs/:jobId/output" element={
          <ProtectedRoute>
            <JobOutputPage />
          </ProtectedRoute>
        } />
        <Route path="/:slug/users" element={
          <ProtectedRoute requiredRole="admin">
            <UserManagementPage />
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Suspense>
  );
};

export default App;
