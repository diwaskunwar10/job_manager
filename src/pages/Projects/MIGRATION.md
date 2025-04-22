# Projects Module Migration Guide

This document outlines the migration of the Projects module to a more structured organization.

## New Directory Structure

```
src/pages/Projects/
├── README.md                       # Documentation for the Projects module
├── MIGRATION.md                    # This migration guide
├── index.tsx                       # Main entry point
├── containers/                     # Container components
│   ├── README.md                   # Documentation for containers
│   └── ProjectsContainer.tsx       # Main container
├── components/                     # Components specific to Projects
│   ├── README.md                   # Documentation for components
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
│   ├── README.md                   # Documentation for hooks
│   ├── useProjects.ts              # Hook for project data and operations
│   └── useProjectJobs.ts           # Hook for job data and operations
└── types/                          # Type definitions
    └── index.ts                    # Export all types
```

## Completed Tasks

1. Created directory structure
2. Added documentation (README.md files)
3. Created centralized type definitions
4. Updated and moved key components:
   - ProjectLayout.tsx -> components/common/ProjectLayout.tsx
   - LoadingState.tsx -> components/common/LoadingState.tsx
   - ProjectDetail.tsx -> components/detail/ProjectDetail.tsx
   - ProjectList.tsx -> components/list/ProjectList.tsx
   - EmptyProjectState.tsx -> components/list/EmptyProjectState.tsx
5. Updated imports in key files
6. Improved typing and documentation

## Remaining Tasks

1. Move the remaining components to their appropriate directories:
   - ProjectDetailHeader.tsx -> components/detail/
   - ProjectDetailsTab.tsx -> components/detail/
   - ProjectTabs.tsx -> components/detail/
   - EditProjectDialog.tsx -> components/detail/
   - ProjectsHeader.tsx -> components/list/
   - FilterBar.tsx -> components/list/
   - NewProjectDialog.tsx -> components/list/
   - ProjectJobsTab.tsx -> components/jobs/
   - ProjectJobs.tsx -> components/jobs/
   - JobOutputView.tsx -> components/jobs/
   - NewJobDialog.tsx -> components/jobs/
   - All job-related components -> components/jobs/job-components/

2. Update import paths in all components

3. Update the useProjectJobs.ts hook to use the new types

## Migration Steps

For each component that needs to be moved:

1. Create the new file in the appropriate directory
2. Copy the content from the old file
3. Update imports to use the new paths
4. Update the component to use the centralized types
5. Add documentation comments
6. Test the component

## Testing

After completing the migration, test the following functionality:

1. Project list display and pagination
2. Project selection
3. Project details display
4. Project creation and editing
5. Job list display and filtering
6. Job output display

## Notes

- The migration is being done incrementally to minimize disruption
- The old files will be removed once the migration is complete and tested
- Global components should be moved to the appropriate global directories
