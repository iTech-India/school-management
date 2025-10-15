import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { Lock, ArrowLeft } from 'lucide-react';
import Layout from '../../components/Layout';
import { changePasswordSchema, type ChangePasswordFormData } from '../../schemas/auth.schema';
import FormField from '../../components/FormField';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await authService.changePassword(data);
      toast.success('Password changed successfully!');
      reset();
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
        </div>

        <div className="card">
          <div className="flex items-center mb-6">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Lock size={24} className="text-primary-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
              <p className="text-sm text-gray-600 mt-1">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField label="Current Password" error={errors.currentPassword} required>
              <input
                {...register('currentPassword')}
                type="password"
                className={`input ${errors.currentPassword ? 'border-red-500' : ''}`}
                placeholder="Enter current password"
              />
            </FormField>

            <FormField label="New Password" error={errors.newPassword} required>
              <input
                {...register('newPassword')}
                type="password"
                className={`input ${errors.newPassword ? 'border-red-500' : ''}`}
                placeholder="Enter new password (min. 6 characters)"
              />
            </FormField>

            <FormField label="Confirm New Password" error={errors.confirmPassword} required>
              <input
                {...register('confirmPassword')}
                type="password"
                className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm new password"
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Password Requirements:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Minimum 6 characters long</li>
            <li>• Must be different from your current password</li>
            <li>• Use a strong, unique password</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ChangePassword;
