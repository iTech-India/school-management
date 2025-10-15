import { z } from 'zod';

const phoneSchema = z.string()
  .min(1, 'Phone number is required')
  .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number');

const nameSchema = z.string()
  .min(1, 'This field is required')
  .min(2, 'Must be at least 2 characters');

// Teacher Profile Update Schema
export const teacherProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phoneNumber: phoneSchema,
  qualification: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
});

export type TeacherProfileFormData = z.infer<typeof teacherProfileSchema>;

// Student Profile Update Schema
export const studentProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phoneNumber: phoneSchema,
  parentPhoneNumber: phoneSchema.optional().or(z.literal('')),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export type StudentProfileFormData = z.infer<typeof studentProfileSchema>;

