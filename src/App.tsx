
import { useEffect } from "react";
import { setupGlobalAuthErrorHandler } from "./utils/authErrorHandler";
import { useAppDispatch } from "./redux/hooks";
import { checkAuthStatus } from "./redux/actions/authActions";
import { AppRouter } from "./routes";

/**
 * Main App component
 * Handles global setup and renders the router
 */
const App = () => {
  const dispatch = useAppDispatch();

  // Check authentication status on mount
  useEffect(() => {
    // Set up global auth error handler
    setupGlobalAuthErrorHandler();

    // Check authentication status
    dispatch(checkAuthStatus() as any);
  }, [dispatch]);

  return <AppRouter />;
};

export default App;
