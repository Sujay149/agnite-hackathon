import { z } from 'zod';

// Example validation schema for user input
export const userInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Example validation schema for safety incident report
export const safetyIncidentSchema = z.object({
  incidentType: z.string().min(1, 'Incident type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
});

// Function to validate user input
export const validateUserInput = (data: any) => {
  return userInputSchema.safeParse(data);
};

// Function to validate safety incident report
export const validateSafetyIncident = (data: any) => {
  return safetyIncidentSchema.safeParse(data);
};