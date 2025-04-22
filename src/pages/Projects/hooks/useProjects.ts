/**
 * useProjects Hook
 *
 * Custom hook for managing projects data and operations.
 * Handles fetching projects, pagination, and project details.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { projectService } from '@/services/projectService';
import { Project, ProjectDetail, ProjectsMeta } from '../types';

export const useProjects = (
  slug: string | undefined,
  page: number,
  pageSize: number
) => {
  // Available page size options
  const pageSizeOptions = [5, 10, 20, 50];
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for projects list
  const [projects, setProjects] = useState<Project[]>([]);
  const [meta, setMeta] = useState<ProjectsMeta>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1
  });
  const [isLoading, setIsLoading] = useState(true);

  // State for project detail
  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Ref to prevent concurrent API calls
  const isFetchInProgress = useRef(false);

  // Ref to track previous pagination values
  const prevPaginationRef = useRef({ page, pageSize });

  // Fetch projects list
  const fetchProjects = useCallback(async () => {
    // Prevent concurrent API calls
    if (isFetchInProgress.current) {
      console.log('Projects fetch already in progress, skipping...');
      return;
    }

    if (!slug) return;

    isFetchInProgress.current = true;
    setIsLoading(true);

    try {
      const response = await projectService.getProjects(page, pageSize);

      setProjects(response.data || []);

      // Map API response to expected format
      // The API returns meta with page, page_size, total, total_pages
      // But our component expects page, pageSize, total, totalPages
      const apiMeta = response.meta || {};
      setMeta({
        total: apiMeta.total || 0,
        page: apiMeta.page || 1,
        pageSize: apiMeta.page_size || 10,
        totalPages: apiMeta.total_pages || 1
      });

      toast({
        title: "Projects Loaded",
        description: "Project list has been updated."
      });
    } catch (error) {
      console.error("Error fetching projects:", error);

      if (error instanceof Error && error.message.includes('401')) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive"
        });
        // Don't redirect, just show the error
        // navigate(`/${slug}/login`);
        // return;
      }

      toast({
        title: "Error Loading Projects",
        description: "Failed to load projects. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      isFetchInProgress.current = false;
    }
  }, [slug, page, pageSize, navigate, toast]);

  // Set project detail from existing projects list
  const fetchProjectDetail = useCallback((projectId: string) => {
    if (!projectId) {
      setProjectDetail(null);
      return;
    }

    setIsDetailLoading(true);

    // Find the project in the existing projects list
    const selectedProject = projects.find(project => project._id === projectId);

    if (selectedProject) {
      // Convert Project to ProjectDetail
      const projectDetail: ProjectDetail = {
        _id: selectedProject._id,
        name: selectedProject.name,
        description: selectedProject.description,
        // Add any other fields that might be available in the Project object
      };

      setProjectDetail(projectDetail);
    } else {
      console.error("Project not found in list:", projectId);
      toast({
        title: "Project Not Found",
        description: "The selected project could not be found.",
        variant: "destructive"
      });
      setProjectDetail(null);
    }

    setIsDetailLoading(false);
  }, [projects, toast]);

  // Fetch projects when pagination changes
  useEffect(() => {
    // Check if page or pageSize has changed
    const prevPagination = prevPaginationRef.current;
    if (prevPagination.page !== page || prevPagination.pageSize !== pageSize) {
      fetchProjects();
      // Update the ref with current values
      prevPaginationRef.current = { page, pageSize };
    } else if (!projects.length) {
      // Initial load if no projects are loaded yet
      fetchProjects();
    }
  }, [page, pageSize, fetchProjects, projects.length]);

  return {
    projects,
    projectDetail,
    meta,
    isLoading,
    isDetailLoading,
    fetchProjects,
    fetchProjectDetail,
    pageSizeOptions
  };
};
