import api from './api';
import { Subject } from '../types';

export const subjectService = {
  async getAll(): Promise<Subject[]> {
    const response = await api.get<Subject[]>('/subjects');
    return response.data;
  },

  async getById(id: string): Promise<Subject> {
    const response = await api.get<Subject>(`/subjects/${id}`);
    return response.data;
  },

  async create(data: Partial<Subject>): Promise<Subject> {
    const response = await api.post<Subject>('/subjects', data);
    return response.data;
  },

  async update(id: string, data: Partial<Subject>): Promise<Subject> {
    const response = await api.patch<Subject>(`/subjects/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/subjects/${id}`);
  },

  async generateCode(subjectName: string) {
    const response = await api.post('/subjects/generate-code', { name: subjectName });
    return response.data; // e.g. "MAT734"
  }
};

