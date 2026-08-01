/**
 * HOSxP Freeze Snapshot & Pre-fetch Staging Service
 * Periodically pre-fetches and freezes snapshot data to ensure app stays available 100% of the time
 */

import { getHosxpCacheDirect, setHosxpCache } from './hosxpCache';

// Mock snapshot fallbacks when DB is unreachable (e.g. Vercel preview or outside hospital LAN)
const MOCK_SNAPSHOT_STATS = {
  totalPatients: 1420,
  appointmentsToday: 18,
  upcomingAppointments: 142,
  missedFollowUps: 24,
};

const MOCK_SNAPSHOT_APPOINTMENTS = [
  {
    id: 'snap-1',
    hn: 'HN-650012',
    patientName: 'นาย สมชาย ใจดี',
    phone: '081-987-6543',
    date: 'วันนี้',
    time: '08:30 น.',
    clinic: 'คลินิกเบาหวาน (NCDs)',
    provider: 'พญ. สุภาพร ใจดี',
    type: 'เจาะเลือดติดตาม FBS/HbA1c',
    status: 'confirmed',
    lineNotified: true,
  },
  {
    id: 'snap-2',
    hn: 'HN-640982',
    patientName: 'นาง สมศรี มีสุข',
    phone: '089-123-4567',
    date: 'วันนี้',
    time: '09:00 น.',
    clinic: 'คลินิกความดันโลหิตสูง (HT)',
    provider: 'นพ. วิชัย รักษาดี',
    type: 'ตรวจติดตามความดันโลหิต',
    status: 'confirmed',
    lineNotified: true,
  },
  {
    id: 'snap-3',
    hn: 'HN-630451',
    patientName: 'นาย บุญส่ง มั่นคง',
    phone: '086-555-1234',
    date: 'พรุ่งนี้',
    time: '08:30 น.',
    clinic: 'คลินิกโรคไตเรื้อรัง (CKD)',
    provider: 'พญ. สุภาพร ใจดี',
    type: 'เจาะเลือดติดตาม eGFR/Cr',
    status: 'scheduled',
    lineNotified: true,
  },
];

const MOCK_SNAPSHOT_FOLLOWUPS = [
  {
    id: 'snap-f1',
    hn: 'HN-620119',
    patientName: 'นาง สมพร ยิ้มสู้',
    phone: '084-321-9876',
    taskType: 'ติดตามขาดนัด NCDs',
    assignedTo: 'พยาบาล NCDs (โรงพยาบาลคลองหาด)',
    dueDate: 'ขาดนัดเมื่อ 3 วันที่แล้ว',
    priority: 'high',
    status: 'todo',
    clinic: 'คลินิกเบาหวาน',
    doctor: 'พญ. สุภาพร ใจดี',
  },
  {
    id: 'snap-f2',
    hn: 'HN-610540',
    patientName: 'นาย ประสิทธิ์ สุขสบาย',
    phone: '087-654-3210',
    taskType: 'ติดตามขาดนัด NCDs',
    assignedTo: 'พยาบาล NCDs (โรงพยาบาลคลองหาด)',
    dueDate: 'ขาดนัดเมื่อ 7 วันที่แล้ว',
    priority: 'urgent',
    status: 'todo',
    clinic: 'คลินิกความดันโลหิตสูง',
    doctor: 'นพ. วิชัย รักษาดี',
  },
];

/**
 * Get snapshot fallback for stats
 */
export function getSnapshotStatsFallback() {
  const cached = getHosxpCacheDirect<any>('hosxp:stats');
  if (cached) {
    return { ...cached.data, isSnapshot: true, snapshotAgeMinutes: Math.round(cached.ageMs / 60000) };
  }
  return {
    stats: MOCK_SNAPSHOT_STATS,
    recentAppointments: MOCK_SNAPSHOT_APPOINTMENTS,
    isSnapshot: true,
    isMockFallback: true,
  };
}

/**
 * Get snapshot fallback for appointments
 */
export function getSnapshotAppointmentsFallback() {
  const cached = getHosxpCacheDirect<any>('hosxp:appointments');
  if (cached) {
    return { appointments: cached.data, isSnapshot: true, snapshotAgeMinutes: Math.round(cached.ageMs / 60000) };
  }
  return {
    appointments: MOCK_SNAPSHOT_APPOINTMENTS,
    isSnapshot: true,
    isMockFallback: true,
  };
}

/**
 * Get snapshot fallback for follow-ups
 */
export function getSnapshotFollowUpsFallback() {
  const cached = getHosxpCacheDirect<any>('hosxp:follow-ups');
  if (cached) {
    return { tasks: cached.data, isSnapshot: true, snapshotAgeMinutes: Math.round(cached.ageMs / 60000) };
  }
  return {
    tasks: MOCK_SNAPSHOT_FOLLOWUPS,
    isSnapshot: true,
    isMockFallback: true,
  };
}

/**
 * Save snapshot data manually
 */
export function freezeHosxpSnapshot(key: string, data: any, ttlMs = 86400000) {
  setHosxpCache(`snapshot:${key}`, data, ttlMs);
}
