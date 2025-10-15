import api from './api';
import { Student } from '../types';

export const studentService = {


  async getSuggestedRollNumberId() {
      const response = await api.get('/students/suggest-rollnumber');
        // assuming backend returns a number, e.g., 21
        return response.data;
  },

  async getAll(classId?: string): Promise<Student[]> {
    const params = classId ? { classId } : {};
    const response = await api.get<Student[]>('/students', { params });
    return response.data;
  },

  async getById(id: string): Promise<Student> {
    const response = await api.get<Student>(`/students/${id}`);
    return response.data;
  },

  async getProfile(): Promise<Student> {
    const response = await api.get<Student>('/students/profile');
    return response.data;
  },

  async create(data: Partial<Student>): Promise<Student> {
    const response = await api.post<Student>('/students', data);
    return response.data;
  },

  async update(id: string, data: Partial<Student>): Promise<Student> {
    const response = await api.patch<Student>(`/students/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/students/${id}`);
  },
};

