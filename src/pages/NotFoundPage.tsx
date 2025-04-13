
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const NotFoundPage: React.FC = () => {
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
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 overflow-hidden">
      <div className="relative w-full max-w-lg px-4">
        {/* Background animation elements */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-brand-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            <h1 className="text-9xl font-bold text-brand-600 animate-on-mount">404</h1>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 animate-on-mount">Page Not Found</h2>
            <p className="mt-2 text-lg text-gray-600 animate-on-mount">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="mt-8 animate-on-mount">
              <button
                onClick={handleGoBack}
                className="px-6 py-3 text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors"
              >
                Go Back
              </button>
            </div>
            
            {/* SVG animation */}
            <div className="mt-12 animate-on-mount">
              <svg className="w-full h-48" viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg">
                <path 
                  className="fill-brand-100 stroke-brand-500" 
                  strokeWidth="2"
                  d="M0,120 C120,180 180,60 240,120 C300,180 360,60 480,120 L480,240 L0,240 Z"
                >
                  <animate 
                    attributeName="d" 
                    dur="5s" 
                    repeatCount="indefinite"
                    values="
                      M0,120 C120,180 180,60 240,120 C300,180 360,60 480,120 L480,240 L0,240 Z;
                      M0,120 C120,60 180,180 240,120 C300,60 360,180 480,120 L480,240 L0,240 Z;
                      M0,120 C120,180 180,60 240,120 C300,180 360,60 480,120 L480,240 L0,240 Z
                    "
                  />
                </path>
                
                <circle cx="100" cy="100" r="10" fill="#0284c7">
                  <animate 
                    attributeName="cy" 
                    values="100;80;100" 
                    dur="3s" 
                    repeatCount="indefinite" 
                  />
                </circle>
                
                <circle cx="240" cy="120" r="15" fill="#0ea5e9">
                  <animate 
                    attributeName="cy" 
                    values="120;90;120" 
                    dur="3.5s" 
                    repeatCount="indefinite" 
                  />
                </circle>
                
                <circle cx="380" cy="100" r="8" fill="#38bdf8">
                  <animate 
                    attributeName="cy" 
                    values="100;70;100" 
                    dur="4s" 
                    repeatCount="indefinite" 
                  />
                </circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Replace the style jsx element with a style tag */}
      <style>
        {`
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        `}
      </style>
    </div>
  );
};

export default NotFoundPage;
