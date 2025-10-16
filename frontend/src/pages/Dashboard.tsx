import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Users, GraduationCap, BookOpen, Calendar } from 'lucide-react';
import { teacherService } from '../services/teacherService';
import { studentService } from '../services/studentService';
import { classService } from '../services/classService';
import { attendanceService } from '../services/attendanceService';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    classes: 0,
    todayAttendance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.role === UserRole.ADMIN) {
          const [teachers, students, classes] = await Promise.all([
            teacherService.getAll(),
            studentService.getAll(),
            classService.getAll(),
          ]);

          setStats({
            teachers: teachers.length,
            students: students.length,
            classes: classes.length,
            todayAttendance: 0, // Can be calculated based on today's attendance
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome back, {user?.email}!
      </h1>

      {user?.role === UserRole.ADMIN && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Teachers</p>
                <p className="text-3xl font-bold mt-2">{stats.teachers}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Users size={32} />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Students</p>
                <p className="text-3xl font-bold mt-2">{stats.students}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <GraduationCap size={32} />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Classes</p>
                <p className="text-3xl font-bold mt-2">{stats.classes}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <BookOpen size={32} />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Today's Attendance</p>
                <p className="text-3xl font-bold mt-2">{stats.todayAttendance}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Calendar size={32} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role === UserRole.ADMIN && (
            <>
              <a
                href="/teachers"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
              >
                <h3 className="font-semibold text-gray-900">Manage Teachers</h3>
                <p className="text-sm text-gray-600 mt-1">Add, edit, or remove teachers</p>
              </a>
              <a
                href="/students"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
              >
                <h3 className="font-semibold text-gray-900">Manage Students</h3>
                <p className="text-sm text-gray-600 mt-1">Add, edit, or remove students</p>
              </a>
              <a
                href="/attendance"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
              >
                <h3 className="font-semibold text-gray-900">View Attendance</h3>
                <p className="text-sm text-gray-600 mt-1">Check attendance records</p>
              </a>
            </>
          )}

          {user?.role === UserRole.TEACHER && (
            <>
              <a
                href="/mark-attendance"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
              >
                <h3 className="font-semibold text-gray-900">Mark Attendance</h3>
                <p className="text-sm text-gray-600 mt-1">Mark student attendance</p>
              </a>
              <a
                href="/my-classes"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
              >
                <h3 className="font-semibold text-gray-900">My Classes</h3>
                <p className="text-sm text-gray-600 mt-1">View your assigned classes</p>
              </a>
            </>
          )}

          {user?.role === UserRole.STUDENT && (
            <a
              href="/my-attendance"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
            >
              <h3 className="font-semibold text-gray-900">My Attendance</h3>
              <p className="text-sm text-gray-600 mt-1">View your attendance records</p>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

