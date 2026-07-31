export type AppointmentStatus =
  | 'scheduled'
  | 'pending_contact'
  | 'confirmed'
  | 'reschedule_request'
  | 'rescheduled'
  | 'arrived'
  | 'completed'
  | 'missed'
  | 'cancelled'
  | 'referred';

export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
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
];
