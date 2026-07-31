import { z } from 'zod';

export const patientSchema = z.object({
  hn: z.string().min(1, 'HN is required'),
  title: z.string().optional(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format').optional(),
  gender: z.string().optional(),
  phone_primary: z.string().min(9, 'Primary phone must be at least 9 characters').max(15, 'Primary phone must be under 15 characters').optional(),
  phone_secondary: z.string().max(15, 'Secondary phone must be under 15 characters').optional(),
  line_id: z.string().optional(),
  preferred_contact_method: z.enum(['phone', 'line', 'in_person', 'other']).default('phone'),
  preferred_contact_time: z.string().optional(),
  contact_consent: z.boolean().default(false),
  patient_status: z.enum(['active', 'inactive', 'deceased']).default('active')
});

export type PatientInput = z.infer<typeof patientSchema>;
