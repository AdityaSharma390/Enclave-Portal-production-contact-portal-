import { z } from 'zod';

export const createContactSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters')
    .trim(),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .trim()
    .max(100, 'Company name cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .trim()
    .max(200, 'Address cannot exceed 200 characters')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .trim()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
});

export const updateContactSchema = createContactSchema.partial();
