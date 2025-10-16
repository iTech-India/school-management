import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    try {
      const response = await authService.verifyEmail({ token });
      setStatus('success');
      setMessage(response.message);
      toast.success('Email verified successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      const errorMessage = error.response?.data?.message || 'Email verification failed';
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <div className="bg-blue-100 p-3 rounded-full">
                <Loader size={48} className="text-blue-600 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle size={48} className="text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle size={48} className="text-red-600" />
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>

          <p className="text-gray-600 mb-6">{message || 'Please wait while we verify your email address.'}</p>

          {status === 'success' && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-sm text-green-700">
                Redirecting to login page in 3 seconds...
              </p>
            </div>
          )}

          {status !== 'loading' && (
            <Link
              to="/login"
              className="inline-block w-full btn btn-primary"
            >
              Go to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

