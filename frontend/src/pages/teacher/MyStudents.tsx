import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Student, TeacherAssignment } from '../../types';
import { toast } from 'react-toastify';
import { Users, Phone, User } from 'lucide-react';

const MyStudents: React.FC = () => {
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      const assignment = assignments.find((a) => a.classId === selectedClass);
      if (assignment && assignment.class?.students) {
        setStudents(assignment.class.students);
      } else {
        setStudents([]);
      }
    } else {
      // Show all students from all classes
      const allStudents = assignments.flatMap((a) => a.class?.students || []);
      setStudents(allStudents);
    }
  }, [selectedClass, assignments]);

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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Students</h1>

      {/* Class Filter */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input"
            >
              <option value="">All Classes</option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.classId}>
                  {assignment.class?.name} {assignment.class?.section} - {assignment.subject?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 w-full">
              <div className="flex items-center">
                <Users className="text-primary-600 mr-2" size={20} />
                <span className="text-sm text-gray-600">Total Students: </span>
                <span className="ml-2 text-lg font-semibold text-primary-600">
                  {students.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden">
        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Roll Number</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Class</th>
                  <th className="table-header">Student Phone</th>
                  <th className="table-header">Parent Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium text-gray-900">
                      {student.rollNumber}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <User size={16} className="mr-2 text-gray-400" />
                        {student.firstName} {student.lastName}
                      </div>
                    </td>
                    <td className="table-cell text-sm text-gray-600">
                      {student.user?.email || 'N/A'}
                    </td>
                    <td className="table-cell">
                      <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium">
                        {student.class?.name} {student.class?.section}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center text-sm">
                        <Phone size={14} className="mr-1 text-gray-400" />
                        {student.phoneNumber}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center text-sm font-medium text-primary-600">
                        <Phone size={14} className="mr-1" />
                        {student.parentPhoneNumber || 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {selectedClass
                ? 'No students found in this class'
                : 'No students found in your classes'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStudents;

