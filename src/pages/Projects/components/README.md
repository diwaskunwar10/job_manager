# Project Components

This directory contains components used in the Projects module, organized by feature.

## Directory Structure

- **common/** - Common components used across the Projects module
  - `LoadingState.tsx` - Loading state display
  - `ProjectLayout.tsx` - Main layout for the Projects page

- **detail/** - Components for displaying project details
  - `ProjectDetail.tsx` - Main project detail view
  - `ProjectDetailHeader.tsx` - Header for project details
  - `ProjectDetailsTab.tsx` - Tab for project details
  - `ProjectTabs.tsx` - Tabs navigation
  - `EditProjectDialog.tsx` - Dialog for editing projects

- **list/** - Components for displaying the project list
  - `ProjectList.tsx` - List of projects
  - `ProjectsHeader.tsx` - Header for projects list
  - `FilterBar.tsx` - Filtering options
  - `EmptyProjectState.tsx` - Empty state display
  - `NewProjectDialog.tsx` - Dialog for creating new projects

- **jobs/** - Components for managing project jobs
  - `ProjectJobsTab.tsx` - Tab for project jobs
  - `ProjectJobs.tsx` - Jobs management
  - `JobOutputView.tsx` - View for job outputs
  - `NewJobDialog.tsx` - Dialog for creating new jobs
  - **job-components/** - Nested job components
    - `JobsTable.tsx` - Table of jobs
    - `JobsFilter.tsx` - Filtering for jobs
    - `JobsPagination.tsx` - Pagination for jobs
    - `JobStatusBadge.tsx` - Status badge for jobs
    - `OutputItem.tsx` - Display for job output items
