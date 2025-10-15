import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import { GraduationCap, Mail } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '../../schemas/auth.schema';
import FormField from '../../components/FormField';

const Register: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });
      setEmail(data.email);
      setSuccess(true);
      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Mail size={48} className="text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h1>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to <strong>{email}</strong>.
              Please check your email and click the link to verify your account.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-700">
                Can't find the email? Check your spam folder.
              </p>
            </div>
            <Link to="/login" className="inline-block w-full btn btn-primary">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <GraduationCap size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join our School Management System</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" error={errors.firstName} required>
              <input
                {...register('firstName')}
                type="text"
                className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                placeholder="John"
              />
            </FormField>

            <FormField label="Last Name" error={errors.lastName} required>
              <input
                {...register('lastName')}
                type="text"
                className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                placeholder="Doe"
              />
            </FormField>
          </div>

          <FormField label="Email Address" error={errors.email} required>
            <input
              {...register('email')}
              type="email"
              className={`input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="john.doe@example.com"
            />
          </FormField>

          <FormField label="Phone Number" error={errors.phoneNumber} required>
            <input
              {...register('phoneNumber')}
              type="tel"
              className={`input ${errors.phoneNumber ? 'border-red-500' : ''}`}
              placeholder="+1234567890"
            />
          </FormField>

          <FormField label="Password" error={errors.password} required>
            <input
              {...register('password')}
              type="password"
              className={`input ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Min. 6 characters"
            />
          </FormField>

          <FormField label="Confirm Password" error={errors.confirmPassword} required>
            <input
              {...register('confirmPassword')}
              type="password"
              className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirm your password"
            />
          </FormField>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
