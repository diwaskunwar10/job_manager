import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routeConfig";
import { PageLoader } from "./lazyComponents";

/**
 * Main application router component
 * Renders all application routes with lazy loading
 */
const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
