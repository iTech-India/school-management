import api from './api';
import { LoginCredentials, SetPasswordData, AuthResponse } from '../types';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailData {
  token: string;
}

export const authService = {
  async register(data: RegisterData): Promise<{ message: string; email: string }> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async verifyEmail(data: VerifyEmailData): Promise<{ message: string }> {
    const response = await api.post('/auth/verify-email', data);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async setPassword(data: SetPasswordData): Promise<{ message: string }> {
    const response = await api.post('/auth/set-password', data);
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setToken(token: string): void {
    localStorage.setItem('token', token);
  },

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  },
};
