
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Direct redirect to 404 without using useEffect or useNavigate
  return <Navigate to="/404" replace />;
};

export default Index;
