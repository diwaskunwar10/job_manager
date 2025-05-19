
import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '../redux/hooks';
import { selectIsAuthenticated } from '../redux/slices/authSlice';
import { API_CONFIG } from '../config/environment';

const TenantSlugPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { checkTenantExists, state } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const apiCallMadeRef = useRef(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    const initializeTenant = async () => {
      // Only proceed if we haven't made an API call yet
      if (apiCallMadeRef.current) return;

      // Check if we're at the root route
      if (!slug) {
        // Check if tenant slug exists in localStorage
        const tenantSlug = localStorage.getItem('aroma_tenant_slug') || localStorage.getItem(API_CONFIG.TENANT_SLUG_KEY);

        if (!tenantSlug) {
          // No tenant slug found, redirect to 404
          navigate('/404');
          return;
        }

        // Tenant slug exists, redirect to dashboard or login
        if (isAuthenticated) {
          navigate(`/${tenantSlug}/dashboard`);
        } else {
          navigate(`/${tenantSlug}/login`);
        }
        return;
      }

      try {
        apiCallMadeRef.current = true; // Mark that we've made the API call

        const exists = await checkTenantExists(slug);

        if (exists) {
          // Check if user is already authenticated
          if (isAuthenticated) {
            // If authenticated, go directly to dashboard
            navigate(`/${slug}/dashboard`);
          } else {
            // If not authenticated, go to login page
            navigate(`/${slug}/login`);
          }
        } else {
          toast({
            title: "Invalid Tenant",
            description: `The tenant "${slug}" does not exist.`,
            variant: "destructive",
          });
          navigate('/404');
        }
      } catch (error) {
        console.error("Error in tenant initialization:", error);
        navigate('/404');
      }
    };

    initializeTenant();
  }, [isAuthenticated]);  // Include isAuthenticated in dependencies

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-24 h-24 mb-4">
          <div className="w-full h-full rounded-full bg-blue-100 animate-pulse-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-blue-500">{slug?.charAt(0)?.toUpperCase() || '?'}</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Initializing {slug || 'Tenant'}</h1>
        <p className="text-gray-500">Please wait while we load your tenant...</p>
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full w-1/3 animate-pulse-slow" />
        </div>
      </div>
    </div>
  );
};

export default TenantSlugPage;
