# Projects Module

This module handles the display and management of projects within the application.

## Structure

The Projects module follows a structured organization:

```
src/pages/Projects/
├── README.md                       # This documentation file
├── index.tsx                       # Main entry point
├── containers/                     # Container components
│   └── ProjectsContainer.tsx       # Main container
├── components/                     # Components specific to Projects
│   ├── detail/                     # Project detail components
│   │   ├── ProjectDetail.tsx       # Main project detail view
│   │   ├── ProjectDetailHeader.tsx # Header for project details
│   │   ├── ProjectDetailsTab.tsx   # Tab for project details
│   │   ├── ProjectTabs.tsx         # Tabs navigation
│   │   └── EditProjectDialog.tsx   # Dialog for editing projects
│   ├── list/                       # Project list components
│   │   ├── ProjectList.tsx         # List of projects
│   │   ├── ProjectsHeader.tsx      # Header for projects list
│   │   ├── FilterBar.tsx           # Filtering options
│   │   ├── EmptyProjectState.tsx   # Empty state display
│   │   └── NewProjectDialog.tsx    # Dialog for creating new projects
│   ├── jobs/                       # Job-related components
│   │   ├── ProjectJobsTab.tsx      # Tab for project jobs
│   │   ├── ProjectJobs.tsx         # Jobs management
│   │   ├── JobOutputView.tsx       # View for job outputs
│   │   ├── NewJobDialog.tsx        # Dialog for creating new jobs
│   │   └── job-components/         # Nested job components
│   │       ├── JobsTable.tsx       # Table of jobs
│   │       ├── JobsFilter.tsx      # Filtering for jobs
│   │       └── ...                 # Other job-related components
│   └── common/                     # Common components used across project pages
│       ├── LoadingState.tsx        # Loading state display
│       └── ProjectLayout.tsx       # Main layout for projects
├── hooks/                          # Custom hooks
│   ├── useProjects.ts              # Hook for project data and operations
│   └── useProjectJobs.ts           # Hook for job data and operations
└── types/                          # Type definitions
    └── index.ts                    # Export all types
```

## Main Components

### ProjectsContainer

The main container component that manages the state and data flow for the Projects page.

### ProjectLayout

The layout component that structures the Projects page with three columns:
- Left: Project list
- Middle: Project details or job output
- Right: Additional information or actions

### ProjectDetail

Displays detailed information about a selected project, including tabs for details and jobs.

### ProjectJobs

Manages and displays jobs associated with a project, including filtering, pagination, and actions.

## Data Flow

1. The `ProjectsContainer` fetches project data using the `useProjects` hook
2. Project data is passed to the `ProjectLayout` component
3. When a project is selected, its details are displayed in the `ProjectDetail` component
4. The `ProjectJobsTab` component uses the `useProjectJobs` hook to fetch and display jobs

## API Integration

The module interacts with the following API endpoints:
- GET /projects - Fetch list of projects
- GET /projects/{id} - Fetch project details
- POST /projects - Create a new project
- PUT /projects/{id} - Update a project
- DELETE /projects/{id} - Delete a project
- GET /projects/{id}/jobs - Fetch jobs for a project
- POST /projects/{id}/jobs - Create a new job
- GET /jobs/output/{id} - Fetch job output

## State Management

Project state is managed through Redux using the `projectsSlice` reducer, which handles:
- Project list data
- Selected project details
- Loading states
- Pagination metadata
