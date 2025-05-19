# Logout Page

This directory contains components related to the logout functionality, following the container/component pattern.

## Structure

- `index.tsx` - Entry point that imports the container
- `containers/Logout.container.tsx` - Container component that handles state and logic
- `components/Logout.component.tsx` - Presentational component that renders the UI

## Usage

The logout page is used to log out users and redirect them to the login page.

```jsx
import LogoutPage from './pages/Logout';

// In your routes
<Route path="/:slug/logout" element={<LogoutPage />} />
```

## Container/Component Pattern

This module follows the container/component pattern:

- **Container**: Handles state management, API calls, and business logic
- **Component**: Focuses on UI rendering and user interactions

## Features

- Automatic logout on page load
- Redirect to login page after logout
- Preserves tenant slug for redirection
- Enhanced loading animation during logout process
