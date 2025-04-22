# Project Containers

This directory contains container components for the Projects module.

## ProjectsContainer

The main container component for the Projects module. This component manages the state and data flow for the Projects page, including:

- Pagination
- Project selection
- Filtering
- Project creation
- Error handling

### Usage

```tsx
<ProjectsContainer />
```

The ProjectsContainer is responsible for:

1. Fetching projects data using the `useProjects` hook
2. Managing pagination state
3. Managing filter state
4. Handling project selection
5. Passing data and callbacks to the `ProjectLayout` component

### Props

The ProjectsContainer doesn't accept any props as it's the top-level container component for the Projects page.
