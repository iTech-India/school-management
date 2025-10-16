import React, { useEffect, useState } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { Attendance, AttendanceStatus } from '../../types';
import { toast } from 'react-toastify';
import { format, subDays } from 'date-fns';
import { Calendar } from 'lucide-react';

const MyAttendance: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(
    subDays(new Date(), 30).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
  });

  useEffect(() => {
    fetchAttendance();
  }, [startDate, endDate]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getMyAttendance(startDate, endDate);
      setAttendances(data);
      calculateStats(data);
    } catch (error) {
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Attendance[]) => {
    const stats = {
      total: data.length,
      present: data.filter((a) => a.status === AttendanceStatus.PRESENT).length,
      absent: data.filter((a) => a.status === AttendanceStatus.ABSENT).length,
      late: data.filter((a) => a.status === AttendanceStatus.LATE).length,
      excused: data.filter((a) => a.status === AttendanceStatus.EXCUSED).length,
    };
    setStats(stats);
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

  const attendancePercentage = stats.total > 0 
    ? ((stats.present / stats.total) * 100).toFixed(1) 
    : '0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Attendance</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <p className="text-sm opacity-90">Total Days</p>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-sm opacity-90">Present</p>
          <p className="text-3xl font-bold mt-2">{stats.present}</p>
        </div>
        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <p className="text-sm opacity-90">Absent</p>
          <p className="text-3xl font-bold mt-2">{stats.absent}</p>
        </div>
        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <p className="text-sm opacity-90">Late</p>
          <p className="text-3xl font-bold mt-2">{stats.late}</p>
        </div>
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-sm opacity-90">Attendance %</p>
          <p className="text-3xl font-bold mt-2">{attendancePercentage}%</p>
        </div>
      </div>

      {/* Date Filter */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="card overflow-hidden">
        {attendances.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Date</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendances.map((attendance) => (
                  <tr key={attendance.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        {format(new Date(attendance.date), 'MMMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="table-cell">{getStatusBadge(attendance.status)}</td>
                    <td className="table-cell">{attendance.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No attendance records found for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAttendance;

