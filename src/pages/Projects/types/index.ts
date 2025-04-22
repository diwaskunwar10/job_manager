// Export all project-related types
import { Project, ProjectDetail, Job } from '@/services/projectService';
import { OutputItem, JobOutput } from '@/types/job';

// Re-export types from services
export type { Project, ProjectDetail, Job, OutputItem, JobOutput };

// Project-specific types
export interface ProjectsFilterState {
  searchTerm: string;
  sortDirection: 'asc' | 'desc';
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export interface ProjectsMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface JobOutputInfo {
  jobId: string;
  jobName: string;
}

export type ViewState = 'projects' | 'job-output';

// Job-specific types
export interface JobsFilterState {
  status?: string;
  verified?: boolean;
  searchQuery: string;
  createdAtStart?: Date;
  createdAtEnd?: Date;
}

export interface JobsMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface JobsFilter {
  jobStatus?: 'pending' | 'failed' | 'completed' | 'in-progress';
  verified?: boolean;
  searchQuery?: string;
  page: number;
  pageSize: number;
}
