
// API Endpoints constants
export const AUTH = {
  LOGIN: "/login",
  LOGOUT: "/logout",
};

export const TENANTS = {
  GET_TENANT_ID: "/get_tenant_id",
};

export const JOBS = {
  GET_JOBS: "/get_jobs",
  GET_JOB_BY_ID: (jobId: string) => `/jobs/${jobId}`,
  EXECUTE_JOB: (jobId: string) => `/jobs/${jobId}/execute`,
  RE_EXECUTE_JOB: (jobId: string) => `/jobs/${jobId}/reexecute`,
  JOB_OUTPUT: (jobId: string) => `/job_output/${jobId}`,
  ASSIGN_AGENT: (jobId: string) => `/jobs/${jobId}/assign`,
  UNASSIGN_AGENT: (jobId: string, agentId: string) => `/unassign_job/${jobId}/${agentId}`,
  GET_ASSIGNED_AGENTS: (jobId: string) => `/jobs/${jobId}/agents`,
  JOBS_BY_PROJECT: (projectId: string) => `/jobs/${projectId}`,
  JOBS_VERIFIED_COUNT: "/jobs/verified/counts",
  JOBS_STATUS_COUNT: "/jobs/status/count",
  JOBS_UNASSIGNED_COUNT: "/jobs/unassigned/count",
};

export const PROJECTS = {
  GET_PROJECTS: "/get_projects",
  PROJECT_BY_ID: (projectId: string) => `/projects/${projectId}`,
};

export const AGENTS = {
  GET_ALL_AGENTS: "/agents/all",
  PERFORMANCE: "/agents/performance",
};

export const USERS = {
  ROLES_COUNT: "/users/roles/count",
};

export const SUPERVISORS = {
  ASSIGNMENTS: "/supervisors/assignments",
};

// Additional endpoints can be added here as needed
