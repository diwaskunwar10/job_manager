# Login Page

This directory contains components related to the login functionality, following the container/component pattern.

## Structure

- `index.tsx` - Entry point that imports the container
- `containers/Login.container.tsx` - Container component that handles state and logic
- `components/Login.component.tsx` - Presentational component that renders the UI

## Usage

The login page is used to authenticate users and redirect them to the dashboard upon successful login.

```jsx
import LoginPage from './pages/Login';

// In your routes
<Route path="/:slug/login" element={<LoginPage />} />
```

## Container/Component Pattern

This module follows the container/component pattern:

- **Container**: Handles state management, API calls, and business logic
- **Component**: Focuses on UI rendering and user interactions

## Features

- User authentication with username and password
- Error handling for failed login attempts
- Redirect to dashboard on successful login
- Tenant-specific login page
