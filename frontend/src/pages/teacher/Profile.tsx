import React, { useEffect, useState } from 'react';
import { teacherService } from '../../services/teacherService';
import { Teacher } from '../../types';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { User } from 'lucide-react';

const TeacherProfile: React.FC = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await teacherService.getProfile();
      setTeacher(data);
      reset(data);
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!teacher) return;
    
    try {
      await teacherService.update(teacher.id, data);
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

  if (!teacher) {
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
              {teacher.firstName} {teacher.lastName}
            </h2>
            <p className="text-gray-600">{teacher.user?.email}</p>
          </div>
        </div>

        {!editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Employee ID</label>
                <p className="mt-1 text-gray-900">{teacher.employeeId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                <p className="mt-1 text-gray-900">{teacher.phoneNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="mt-1 text-gray-900">
                  {teacher.dateOfBirth
                    ? new Date(teacher.dateOfBirth).toLocaleDateString()
                    : 'Not set'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Qualification</label>
                <p className="mt-1 text-gray-900">{teacher.qualification || 'Not set'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Address</label>
              <p className="mt-1 text-gray-900">{teacher.address || 'Not set'}</p>
            </div>

            <div className="pt-4">
              <button onClick={() => setEditing(true)} className="btn btn-primary">
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input {...register('firstName')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input {...register('lastName')} className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input {...register('phoneNumber')} className="input" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea {...register('address')} className="input" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input type="date" {...register('dateOfBirth')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification
                </label>
                <input {...register('qualification')} className="input" />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  reset(teacher);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;

