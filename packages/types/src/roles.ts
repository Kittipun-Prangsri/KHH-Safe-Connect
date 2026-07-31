export type UserRole =
  | 'super_admin'
  | 'hospital_admin'
  | 'ncd_coordinator'
  | 'doctor'
  | 'nurse'
  | 'pharmacist'
  | 'call_center'
  | 'auditor'
  | 'patient'
  | 'caregiver';

export const USER_ROLES: UserRole[] = [
  'super_admin',
  'hospital_admin',
  'ncd_coordinator',
  'doctor',
  'nurse',
  'pharmacist',
  'call_center',
  'auditor',
  'patient',
  'caregiver'
];
