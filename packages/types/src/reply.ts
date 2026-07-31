export type ConversationStatus =
  | 'new'
  | 'assigned'
  | 'in_progress'
  | 'waiting_patient'
  | 'waiting_staff'
  | 'escalated'
  | 'resolved'
  | 'closed';

export const CONVERSATION_STATUSES: ConversationStatus[] = [
  'new',
  'assigned',
  'in_progress',
  'waiting_patient',
  'waiting_staff',
  'escalated',
  'resolved',
  'closed'
];

export type SenderType = 'staff' | 'patient' | 'caregiver';

export const SENDER_TYPES: SenderType[] = ['staff', 'patient', 'caregiver'];

export type MessageType = 'text' | 'attachment' | 'system';

export const MESSAGE_TYPES: MessageType[] = ['text', 'attachment', 'system'];
