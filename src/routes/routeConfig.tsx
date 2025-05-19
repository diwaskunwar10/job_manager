import { Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  TenantSlugPage,
  LoginPage,
  LogoutPage,
  NotFoundPage,
  Dashboard,
  ProjectsPage,
  UserManagementPage
} from "./lazyComponents";

// Define route configuration
export const routes = [
  // Index route - redirect to dashboard if tenant exists, otherwise 404
  {
    path: "/",
    element: <TenantSlugPage />
  },

  // Public routes
  {
    path: "/:slug",
    element: <TenantSlugPage />
  },
  {
    path: "/:slug/login",
    element: <LoginPage />
  },
  {
    path: "/:slug/logout",
    element: <LogoutPage />
  },
  {
    path: "/404",
    element: <NotFoundPage />
  },

  // Protected routes
  {
    path: "/:slug/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/:slug/projects",
    element: (
      <ProtectedRoute>
        <ProjectsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/:slug/projects/:projectId",
    element: (
      <ProtectedRoute>
        <ProjectsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/:slug/users",
    element: (
      <ProtectedRoute requiredRole="admin">
        <UserManagementPage />
      </ProtectedRoute>
    )
  },

  // Catch all route
  {
    path: "*",
    element: <Navigate to="/404" />
  }
];
