import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { projectService, Project, ProjectDetail } from '@/services/projectService';

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
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1
  });
  const [isLoading, setIsLoading] = useState(true);

  // State for project detail
  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Fetch projects list
  const fetchProjects = useCallback(async () => {
    if (!slug) return;

    try {
      setIsLoading(true);

      const response = await projectService.getProjects(page, pageSize);

      console.log("Fetched projects:", response);

      setProjects(response.data || []);
      setMeta(response.meta || {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 1
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

      console.log("Selected project from list:", projectDetail);
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

  // Fetch projects on initial load and when page changes
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
