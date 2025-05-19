# Not Found Page

This directory contains components related to the 404 Not Found page, following the container/component pattern.

## Structure

- `index.tsx` - Entry point that imports the container
- `containers/NotFound.container.tsx` - Container component that handles state and logic
- `components/NotFound.component.tsx` - Presentational component that renders the UI

## Usage

The Not Found page is displayed when a user navigates to a non-existent route.

```jsx
import NotFoundPage from './pages/NotFound';

// In your routes
<Route path="/404" element={<NotFoundPage />} />
<Route path="*" element={<Navigate to="/404" />} />
```

## Container/Component Pattern

This module follows the container/component pattern:

- **Container**: Handles state management, context, and navigation logic
- **Component**: Focuses on UI rendering and animations

## Features

- Animated 404 page with SVG animations
- Context-aware navigation back to appropriate pages
- Error logging for non-existent routes
- Clean separation of concerns between logic and presentation
