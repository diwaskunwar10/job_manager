# Project Hooks

This directory contains custom hooks used in the Projects module.

## useProjects

The `useProjects` hook manages project data and operations, including:

- Fetching projects with pagination
- Managing project details
- Handling loading states
- Error handling

### Usage

```tsx
const {
  projects,
  projectDetail,
  meta,
  isLoading,
  isDetailLoading,
  fetchProjects,
  fetchProjectDetail,
  pageSizeOptions
} = useProjects(slug, currentPage, pageSize);
```

## useProjectJobs

The `useProjectJobs` hook manages jobs data for a specific project, including:

- Fetching jobs with pagination and filtering
- Managing job details
- Handling loading states
- Error handling

### Usage

```tsx
const {
  jobs,
  meta,
  isLoading,
  filters,
  setFilters,
  applyFilters,
  resetFilters,
  fetchJobs
} = useProjectJobs(projectId);
```
