import React, { useEffect, useState } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { classService } from '../../services/classService';
import { Attendance as AttendanceType, Class, AttendanceStatus } from '../../types';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const Attendance: React.FC = () => {
  const [attendances, setAttendances] = useState<AttendanceType[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      fetchAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    try {
      const data = await classService.getAll();
      setClasses(data);
    } catch (error) {
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAll({
        classId: selectedClass,
        date: selectedDate,
      });
      setAttendances(data);
    } catch (error) {
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    const styles = {
      [AttendanceStatus.PRESENT]: 'bg-green-100 text-green-800',
      [AttendanceStatus.ABSENT]: 'bg-red-100 text-red-800',
      [AttendanceStatus.LATE]: 'bg-yellow-100 text-yellow-800',
      [AttendanceStatus.EXCUSED]: 'bg-blue-100 text-blue-800',
    };

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading && classes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Attendance Records</h1>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input"
            >
              <option value="">-- Select Class --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} {cls.section}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input"
            />
          </div>
        </div>
      </div>

      {selectedClass && selectedDate && (
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : attendances.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">Student Name</th>
                    <th className="table-header">Roll Number</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Date</th>
                    <th className="table-header">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendances.map((attendance) => (
                    <tr key={attendance.id} className="hover:bg-gray-50">
                      <td className="table-cell">
                        {attendance.student?.firstName} {attendance.student?.lastName}
                      </td>
                      <td className="table-cell">{attendance.student?.rollNumber}</td>
                      <td className="table-cell">{getStatusBadge(attendance.status)}</td>
                      <td className="table-cell">
                        {format(new Date(attendance.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="table-cell">{attendance.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No attendance records found for the selected date and class.</p>
            </div>
          )}
        </div>
      )}

      {!selectedClass && !selectedDate && (
        <div className="card text-center py-12">
          <p className="text-gray-500">Please select a class and date to view attendance records.</p>
        </div>
      )}
    </div>
  );
};

export default Attendance;

