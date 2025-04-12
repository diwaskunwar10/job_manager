
import React, { useEffect, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

// Lazy load the job component for better performance
const JobComponent = lazy(() => import('./job.component'));

// Loading fallback for lazy loaded component
const JobComponentLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-t-4 border-b-4 border-brand-600 rounded-full animate-spin"></div>
  </div>
);

const JobContainer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();

  // Check if tenant is loaded
  useEffect(() => {
    if (!state.tenant) {
      navigate(`/${slug}`);
      return;
    }
  }, [slug, navigate, state.tenant]);

  if (!state.tenant) {
    return null; // Don't render until tenant is loaded
  }

  return (
    <Suspense fallback={<JobComponentLoader />}>
      <JobComponent tenantName={state.tenant.name} />
    </Suspense>
  );
};

export default JobContainer;
