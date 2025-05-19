import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import NotFoundComponent from '../components/NotFound.component';

/**
 * NotFound Container Component
 * 
 * This component handles the logic for the 404 Not Found page.
 */
const NotFoundContainer: React.FC = () => {
  const navigate = useNavigate();
  let state = { tenant: null, isAuthenticated: false };
  
  try {
    // Try to get context, but don't crash if not available
    const context = useAppContext();
    state = context.state;
  } catch (error) {
    console.error("Context not available:", error);
  }

  // Animation effect on mount
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-mount');
    elements.forEach((el, i) => {
      if (el instanceof HTMLElement) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
          el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 100 * i);
      }
    });
  }, []);
  
  const handleGoBack = () => {
    if (state.tenant?.slug) {
      if (state.isAuthenticated) {
        navigate(`/${state.tenant.slug}/dashboard`);
      } else {
        navigate(`/${state.tenant.slug}/login`);
      }
    } else {
      navigate('/');
    }
  };
  
  return <NotFoundComponent onGoBack={handleGoBack} />;
};

export default NotFoundContainer;
