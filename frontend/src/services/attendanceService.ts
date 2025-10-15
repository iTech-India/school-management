import api from './api';
import { Attendance, AttendanceStatus } from '../types';

export interface BulkAttendanceData {
  date: string;
  classId: string;
  attendances: Array<{
    studentId: string;
    status: AttendanceStatus;
    remarks?: string;
  }>;
}

export const attendanceService = {
  async getAll(params?: {
    studentId?: string;
    classId?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Attendance[]> {
    const response = await api.get<Attendance[]>('/attendance', { params });
    return response.data;
  },

  async getMyAttendance(startDate?: string, endDate?: string): Promise<Attendance[]> {
    const params = { startDate, endDate };
    const response = await api.get<Attendance[]>('/attendance/my-attendance', { params });
    return response.data;
  },

  async create(data: Partial<Attendance>): Promise<Attendance> {
    const response = await api.post<Attendance>('/attendance', data);
    return response.data;
  },

  async createBulk(data: BulkAttendanceData): Promise<Attendance[]> {
    const response = await api.post<Attendance[]>('/attendance/bulk', data);
    return response.data;
  },

  async update(id: string, data: Partial<Attendance>): Promise<Attendance> {
    const response = await api.patch<Attendance>(`/attendance/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/attendance/${id}`);
  },
};

