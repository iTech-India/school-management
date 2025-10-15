import { z } from 'zod';

// Common validation patterns
const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Invalid email address');

const nameSchema = z.string()
  .min(1, 'This field is required')
  .min(2, 'Must be at least 2 characters');

const phoneSchema = z.string()
  .min(1, 'Phone number is required')
  .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number');

const uuidSchema = z.string().uuid('Invalid ID format');

// Teacher Schema
export const teacherSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phoneNumber: phoneSchema,
  employeeId: z.string().min(1, 'Employee ID is required'),
  qualification: z.string().optional(),
  dateOfBirth: z.string().optional(),
  joiningDate: z.string().min(1, 'Joining date is required'),
  address: z.string().optional(),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;

// Student Schema
export const studentSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phoneNumber: phoneSchema,
  rollNumber: z.string().min(1, 'Roll number is required'),
  parentPhoneNumber: phoneSchema.optional().or(z.literal('')),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  admissionDate: z.string().min(1, 'Admission date is required'),
  classId: z.string().optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;

// Class Schema
export const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  section: z.string().min(1, 'Section is required'),
  capacity: z.number()
    .min(1, 'Capacity must be at least 1')
    .max(200, 'Capacity cannot exceed 200'),
});

export type ClassFormData = z.infer<typeof classSchema>;

// Subject Schema
export const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  description: z.string().optional(),
});

export type SubjectFormData = z.infer<typeof subjectSchema>;

// Teacher Assignment Schema
export const teacherAssignmentSchema = z.object({
  teacherId: uuidSchema,
  classId: uuidSchema,
  subjectId: uuidSchema,
  isActive: z.boolean().optional(),
});

export type TeacherAssignmentFormData = z.infer<typeof teacherAssignmentSchema>;

