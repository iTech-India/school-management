import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { TeacherAssignment } from '../../types';
import { toast } from 'react-toastify';
import { BookOpen, Users } from 'lucide-react';

const MyClasses: React.FC = () => {
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/teacher-assignments');
      setAssignments(response.data);
    } catch (error) {
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Classes</h1>

      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="card">
              <div className="flex items-start mb-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <BookOpen size={24} className="text-primary-600" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {assignment.class?.name} {assignment.class?.section}
                  </h3>
                  <p className="text-sm text-gray-600">{assignment.subject?.name}</p>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Users size={16} className="mr-2" />
                <span>{assignment.class?.students?.length || 0} students</span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    assignment.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {assignment.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No class assignments found</p>
        </div>
      )}
    </div>
  );
};

export default MyClasses;

