
// API Endpoints constants
// All endpoints are prefixed with /v1 by the proxy configuration

export const AUTH = {
  LOGIN: "/login",
  LOGOUT: "/logout",
};

export const TENANTS = {
  GET_TENANT_ID: "/get_tenant_id",
};

export const JOBS = {
  // Get all jobs
  GET_JOBS: "/jobs",

  // Get job by ID
  GET_JOB_BY_ID: (jobId: string) => `/jobs/${jobId}`,

  // Execute a job
  EXECUTE_JOB: (jobId: string) => `/jobs/execute/${jobId}`,

  // Re-execute a job
  RE_EXECUTE_JOB: (jobId: string) => `/jobs/reexecute/${jobId}`,

  // Get job output
  JOB_OUTPUT: (jobId: string) => `/jobs/output/${jobId}`,

  // Get presigned URL for media object
  MEDIA_PRESIGNED_URL: "/jobs/media/presigned-url",

  // Add media from URI to job
  ADD_MEDIA_FROM_URI: (jobId: string) => `/jobs/add-media-from-uri/${jobId}`,

  // Assign agent to job
  ASSIGN_AGENT: (jobId: string) => `/jobs/${jobId}/assign`,

  // Unassign agent from job
  UNASSIGN_AGENT: (jobId: string, agentId: string) => `/jobs/${jobId}/unassign/${agentId}`,

  // Get assigned agents for a job
  GET_ASSIGNED_AGENTS: (jobId: string) => `/jobs/${jobId}/agents`,

  // Create a job for a project
  CREATE_JOB: (projectId: string) => `/jobs/create/${projectId}`,

  // Get job status counts
  JOBS_STATUS_COUNT: "/jobs/status/count",

  // Get unassigned jobs count
  JOBS_UNASSIGNED_COUNT: "/jobs/unassigned/count",
};

export const PROJECTS = {
  // Get all projects with pagination
  GET_PROJECTS: "/projects",

  // Get project by ID
  PROJECT_BY_ID: (projectId: string) => `/projects/${projectId}`,

  // Create a new project
  CREATE_PROJECT: "/projects/create",

  // Update a project
  UPDATE_PROJECT: (projectId: string) => `/projects/${projectId}`,

  // Delete a project
  DELETE_PROJECT: (projectId: string) => `/projects/${projectId}`,

  // Get jobs for a project
  PROJECT_JOBS: (projectId: string) => `/projects/${projectId}/jobs`,
};

export const PROCESSES = {
  // Get all available processes
  GET_PROCESSES: "/processes",

  // Get process details
  GET_PROCESS: (processName: string) => `/processes/${processName}`,
};

export const AGENTS = {
  GET_ALL_AGENTS: "/agents/all",
  PERFORMANCE: "/agents/performance",
};

export const USERS = {
  ROLES_COUNT: "/users/roles/count",
  GET_SUBORDINATES: "/users/subordinates",
  CHANGE_ROLE: "/users/change_role",
  RESET_PASSWORD: "/users/reset_password",
  CHANGE_PASSWORD: "/users/change_password",
  DELETE_USER: "/users/delete",
  INVITE_USER: "/users/invite",
};

export const SUPERVISORS = {
  ASSIGNMENTS: "/supervisors/assignments",
};

// Additional endpoints can be added here as needed
