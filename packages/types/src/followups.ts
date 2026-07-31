export type FollowUpStatus =
  | 'todo'
  | 'in_progress'
  | 'waiting_patient'
  | 'completed'
  | 'cancelled'
  | 'overdue';

export const FOLLOW_UP_STATUSES: FollowUpStatus[] = [
  'todo',
  'in_progress',
  'waiting_patient',
  'completed',
  'cancelled',
  'overdue'
];

export type PriorityLevel = 'low' | 'normal' | 'high' | 'urgent';

export const PRIORITY_LEVELS: PriorityLevel[] = ['low', 'normal', 'high', 'urgent'];

export type ContactResult =
  | 'confirmed'
  | 'caregiver_answered'
  | 'no_answer'
  | 'phone_off'
  | 'invalid_number'
  | 'reschedule_requested'
  | 'treated_elsewhere'
  | 'moved'
  | 'refused_contact'
  | 'deceased'
  | 'other';

export const CONTACT_RESULTS: ContactResult[] = [
  'confirmed',
  'caregiver_answered',
  'no_answer',
  'phone_off',
  'invalid_number',
  'reschedule_requested',
  'treated_elsewhere',
  'moved',
  'refused_contact',
  'deceased',
  'other'
];
