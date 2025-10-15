import api from './api';
import { Class } from '../types';

export const classService = {
  async getAll(): Promise<Class[]> {
    const response = await api.get<Class[]>('/classes');
    return response.data;
  },

  async getById(id: string): Promise<Class> {
    const response = await api.get<Class>(`/classes/${id}`);
    return response.data;
  },

  async create(data: Partial<Class>): Promise<Class> {
    const response = await api.post<Class>('/classes', data);
    return response.data;
  },

  async update(id: string, data: Partial<Class>): Promise<Class> {
    const response = await api.patch<Class>(`/classes/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/classes/${id}`);
  },
};

