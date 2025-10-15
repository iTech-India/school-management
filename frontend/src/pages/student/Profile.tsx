import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentService } from '../../services/studentService';
import { Student } from '../../types';
import { toast } from 'react-toastify';
import { User } from 'lucide-react';
import { studentProfileSchema, type StudentProfileFormData } from '../../schemas/profile.schema';
import FormField from '../../components/FormField';

const StudentProfile: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentProfileFormData>({
    resolver: zodResolver(studentProfileSchema),
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await studentService.getProfile();
      setStudent(data);
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        parentPhoneNumber: data.parentPhoneNumber || '',
        address: data.address || '',
        dateOfBirth: data.dateOfBirth || '',
      });
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: StudentProfileFormData) => {
    if (!student) return;
    
    try {
      await studentService.update(student.id, data);
      toast.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="card">
        <div className="flex items-center mb-6">
          <div className="bg-primary-100 p-4 rounded-full">
            <User size={48} className="text-primary-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h2>
            <p className="text-gray-600">{student.user?.email}</p>
          </div>
        </div>

        {!editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Roll Number</label>
                <p className="text-lg text-gray-900 mt-1">{student.rollNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Class</label>
                <p className="text-lg text-gray-900 mt-1">
                  {student.class ? `${student.class.name} ${student.class.section}` : 'Not Assigned'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">First Name</label>
                <p className="text-lg text-gray-900 mt-1">{student.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Name</label>
                <p className="text-lg text-gray-900 mt-1">{student.lastName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                <p className="text-lg text-gray-900 mt-1">{student.phoneNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Parent Phone</label>
                <p className="text-lg text-gray-900 mt-1">{student.parentPhoneNumber || 'Not provided'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Address</label>
              <p className="text-lg text-gray-900 mt-1">{student.address || 'Not provided'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
              <p className="text-lg text-gray-900 mt-1">
                {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not provided'}
              </p>
            </div>

            <div className="pt-4 border-t">
              <button onClick={() => setEditing(true)} className="btn btn-primary">
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="First Name" error={errors.firstName} required>
                <input
                  {...register('firstName')}
                  type="text"
                  className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="First Name"
                />
              </FormField>

              <FormField label="Last Name" error={errors.lastName} required>
                <input
                  {...register('lastName')}
                  type="text"
                  className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Last Name"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Phone Number" error={errors.phoneNumber} required>
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  className={`input ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  placeholder="+1234567890"
                />
              </FormField>

              <FormField label="Parent Phone Number" error={errors.parentPhoneNumber}>
                <input
                  {...register('parentPhoneNumber')}
                  type="tel"
                  className={`input ${errors.parentPhoneNumber ? 'border-red-500' : ''}`}
                  placeholder="+1234567890"
                />
              </FormField>
            </div>

            <FormField label="Address" error={errors.address}>
              <textarea
                {...register('address')}
                rows={3}
                className={`input ${errors.address ? 'border-red-500' : ''}`}
                placeholder="Enter your address"
              />
            </FormField>

            <FormField label="Date of Birth" error={errors.dateOfBirth}>
              <input
                {...register('dateOfBirth')}
                type="date"
                className={`input ${errors.dateOfBirth ? 'border-red-500' : ''}`}
              />
            </FormField>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  reset();
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
