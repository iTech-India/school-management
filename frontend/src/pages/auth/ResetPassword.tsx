import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import { Lock } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../schemas/auth.schema';
import FormField from '../../components/FormField';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await authService.resetPassword({ token, ...data });
      toast.success('Password reset successfully! You can now login.');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <Lock size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField label="New Password" error={errors.password} required>
            <input
              {...register('password')}
              type="password"
              className={`input ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Enter new password"
            />
          </FormField>

          <FormField label="Confirm Password" error={errors.confirmPassword} required>
            <input
              {...register('confirmPassword')}
              type="password"
              className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirm new password"
            />
          </FormField>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
