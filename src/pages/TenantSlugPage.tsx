
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useToast } from '@/hooks/use-toast';

const TenantSlugPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { checkTenantExists, state } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const initializeTenant = async () => {
      if (!slug) {
        navigate('/404');
        return;
      }
      
      try {
        const exists = await checkTenantExists(slug);
        
        if (exists) {
          // If user is already authenticated, go to dashboard, else go to login
          if (state.isAuthenticated) {
            navigate(`/${slug}/dashboard`);
          } else {
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
  }, [slug, navigate, checkTenantExists, state.isAuthenticated, toast]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-24 h-24 mb-4">
          <div className="w-full h-full rounded-full bg-blue-100 animate-pulse-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-blue-500">{slug?.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Initializing {slug}</h1>
        <p className="text-gray-500">Please wait while we load your tenant...</p>
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full w-1/3 animate-pulse-slow" />
        </div>
      </div>
    </div>
  );
};

export default TenantSlugPage;
