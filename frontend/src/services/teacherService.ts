import api from './api';
import { Teacher } from '../types';

export const teacherService = {

  async getSuggestedEmployeeId() {
    const response = await api.get('/teachers/suggest-employee-id');
      // assuming backend returns a number, e.g., 21
      return response.data;
  },

  async getAll(): Promise<Teacher[]> {
    const response = await api.get<Teacher[]>('/teachers');
    return response.data;
  },

  async getById(id: string): Promise<Teacher> {
    const response = await api.get<Teacher>(`/teachers/${id}`);
    return response.data;
  },

  async getProfile(): Promise<Teacher> {
    const response = await api.get<Teacher>('/teachers/profile');
    return response.data;
  },

  async create(data: Partial<Teacher>): Promise<Teacher> {
    const response = await api.post<Teacher>('/teachers', data);
    return response.data;
  },

  async update(id: string, data: Partial<Teacher>): Promise<Teacher> {
    const response = await api.patch<Teacher>(`/teachers/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/teachers/${id}`);
  },

  
};

