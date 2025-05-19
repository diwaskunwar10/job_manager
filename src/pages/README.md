# Pages Directory Structure

This directory contains all the main pages of the application, organized by feature.

## Directory Structure

- **Dashboard/** - Dashboard page and related components
- **Login/** - Login page and authentication components
- **Logout/** - Logout page and related functionality
- **NotFound/** - 404 Not Found page and error handling
- **Projects/** - Project management pages and components
- **UserManagement/** - User management pages and components

## Organization Guidelines

Each feature directory should follow these guidelines:

1. **index.tsx** - Main entry point for the feature
2. **README.md** - Documentation for the feature
3. **components/** - UI components specific to the feature
4. **containers/** - Container components that manage state
5. **hooks/** - Custom hooks specific to the feature
6. **types/** - TypeScript types and interfaces

## Best Practices

- Keep components small and focused on a single responsibility
- Use container/component pattern for complex features
- Document each feature with a README.md file
- Group related components together
- Use consistent naming conventions
