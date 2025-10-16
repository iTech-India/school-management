import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import TeacherProfile from './teacher/Profile';
import StudentProfile from './student/Profile';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Render appropriate profile based on user role
  if (user.role === UserRole.TEACHER) {
    return <TeacherProfile />;
  }

  if (user.role === UserRole.STUDENT) {
    return <StudentProfile />;
  }

  // Admin doesn't have a profile page, redirect to dashboard
  if (user.role === UserRole.ADMIN) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Account</h2>
        <p className="text-gray-600">Admin users don't have a profile page.</p>
        <p className="text-gray-600">You can manage the system from the dashboard.</p>
      </div>
    );
  }

  return null;
};

export default Profile;

