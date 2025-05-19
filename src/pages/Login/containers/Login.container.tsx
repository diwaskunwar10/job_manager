import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { login } from '../../../redux/actions/authActions';
import { selectIsAuthenticated, selectAuthLoading, selectAuthError } from '../../../redux/slices/authSlice';
import LoginComponent from '../components/Login.component';

const LoginContainer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Get auth state from Redux
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);

  useEffect(() => {
    // If tenant not loaded, redirect to tenant page
    if (!state.tenant) {
      navigate(`/${slug}`);
    }

    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate(`/${slug}/dashboard`);
    }
  }, [slug, navigate, state.tenant, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    // Store slug in localStorage
    localStorage.setItem('aroma_slug', slug || '');

    // Use Redux login action with client_id
    await dispatch(login(
      {
        username: email,
        password,
        client_id: slug || 'string',
        grant_type: 'password',
        scope: ''
      },
      // Success callback
      () => {
        toast({
          title: "Login Successful",
          description: "You have been logged in successfully.",
        });

        // Navigate to dashboard
        navigate(`/${slug}/dashboard`);
      },
      // Error callback
      (errorMessage) => {
        toast({
          title: "Login Failed",
          description: errorMessage || "Failed to log in. Please try again.",
          variant: "destructive",
        });
      }
    ) as any); // Type assertion needed due to thunk action
  };

  if (!state.tenant) {
    return null;  // Don't render until tenant is loaded
  }

  return (
    <LoginComponent 
      tenant={state.tenant}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      isLoading={isLoading}
      handleSubmit={handleSubmit}
    />
  );
};

export default LoginContainer;
