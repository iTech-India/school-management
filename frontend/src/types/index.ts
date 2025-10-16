export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  passwordSet: boolean;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  phoneNumber: string;
  address?: string;
  dateOfBirth?: string;
  qualification?: string;
  userId: string;
  user?: User;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  phoneNumber: string;
  parentPhoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  admissionDate: string;
  userId: string;
  classId?: string;
  user?: User;
  class?: Class;
}

export interface Class {
  id: string;
  name: string;
  section?: string;
  description?: string;
  isActive: boolean;
  students?: Student[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  isActive: boolean;
  teacher?: Teacher;
  class?: Class;
  subject?: Subject;
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  student?: Student;
  class?: Class;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

