import { z } from 'zod';

export const appointmentSchema = z.object({
  patient_id: z.string().uuid('Patient ID must be a valid UUID'),
  clinic_id: z.string().uuid('Clinic ID must be a valid UUID').optional(),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Appointment date must be YYYY-MM-DD'),
  appointment_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Appointment time must be HH:MM or HH:MM:SS').optional(),
  appointment_type: z.string().optional(),
  room: z.string().optional(),
  provider_name: z.string().optional(),
  status: z.enum([
    'scheduled',
    'pending_contact',
    'confirmed',
    'reschedule_request',
    'rescheduled',
    'arrived',
    'completed',
    'missed',
    'cancelled',
    'referred'
  ]).default('scheduled'),
  reason: z.string().optional(),
  notes: z.string().optional()
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
