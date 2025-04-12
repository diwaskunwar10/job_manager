import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import JobComponent from './job.component';

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

  return <JobComponent tenantName={state.tenant.name} />;
};

export default JobContainer;
