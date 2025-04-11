
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { lazy, Suspense } from "react";
import NotFoundPage from "./pages/NotFoundPage";

// Lazy load pages for better performance
const TenantSlugPage = lazy(() => import("./pages/TenantSlugPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectsPage = lazy(() => import("./pages/Projects"));
const JobsPage = lazy(() => import("./pages/JobsPage"));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-16 h-16 border-t-4 border-b-4 border-brand-600 rounded-full animate-spin"></div>
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Index route - redirect to 404 if accessed directly */}
              <Route path="/" element={<Navigate to="/404" />} />

              {/* Tenant routes */}
              <Route path="/:slug" element={<TenantSlugPage />} />
              <Route path="/:slug/login" element={<LoginPage />} />
              <Route path="/:slug/dashboard" element={<Dashboard />} />
              <Route path="/:slug/projects" element={<ProjectsPage />} />
              <Route path="/:slug/projects/:projectId" element={<ProjectsPage />} />
              <Route path="/:slug/jobs" element={<JobsPage />} />

              {/* 404 page */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </Suspense>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
