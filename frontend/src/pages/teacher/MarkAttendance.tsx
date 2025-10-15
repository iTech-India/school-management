import React, { useEffect, useState } from 'react';
import { studentService } from '../../services/studentService';
import { classService } from '../../services/classService';
import { attendanceService } from '../../services/attendanceService';
import { Class, Student, AttendanceStatus } from '../../types';
import { toast } from 'react-toastify';

const MarkAttendance: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<
    Record<string, { status: AttendanceStatus; remarks: string }>
  >({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const data = await classService.getAll();
      setClasses(data);
    } catch (error) {
      toast.error('Failed to fetch classes');
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll(selectedClass);
      setStudents(data);
      
      // Initialize attendance state
      const initialAttendance: Record<string, { status: AttendanceStatus; remarks: string }> = {};
      data.forEach((student) => {
        initialAttendance[student.id] = {
          status: AttendanceStatus.PRESENT,
          remarks: '',
        };
      });
      setAttendance(initialAttendance);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedDate) {
      toast.error('Please select a class and date');
      return;
    }

    setSubmitting(true);

    try {
      const attendanceData = Object.entries(attendance).map(([studentId, data]) => ({
        studentId,
        classId: selectedClass,
        date: selectedDate,
        status: data.status,
        remarks: data.remarks,
      }));

      await attendanceService.createBulk({
        date: selectedDate,
        classId: selectedClass,
        attendances: attendanceData,
      });

      toast.success('Attendance marked successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mark Attendance</h1>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input"
            />
          </div>
        </div>
      </div>

      {selectedClass && students.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Roll Number</th>
                  <th className="table-header">Student Name</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="table-cell">{student.rollNumber}</td>
                    <td className="table-cell">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="table-cell">
                      <select
                        value={attendance[student.id]?.status || AttendanceStatus.PRESENT}
                        onChange={(e) =>
                          handleStatusChange(student.id, e.target.value as AttendanceStatus)
                        }
                        className="input"
                      >
                        <option value={AttendanceStatus.PRESENT}>Present</option>
                        <option value={AttendanceStatus.ABSENT}>Absent</option>
                        <option value={AttendanceStatus.LATE}>Late</option>
                        <option value={AttendanceStatus.EXCUSED}>Excused</option>
                      </select>
                    </td>
                    <td className="table-cell">
                      <input
                        type="text"
                        value={attendance[student.id]?.remarks || ''}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        className="input"
                        placeholder="Optional remarks"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-gray-50 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-primary disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </div>
        </div>
      )}

      {selectedClass && students.length === 0 && !loading && (
        <div className="card text-center py-12">
          <p className="text-gray-500">No students found in this class</p>
        </div>
      )}

      {!selectedClass && (
        <div className="card text-center py-12">
          <p className="text-gray-500">Please select a class to mark attendance</p>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;

