import { Router } from 'express';
import { getHosxpPatientByHnOrCid, getHosxpAppointments } from '../services/hosxpService';

const router = Router();

// Test HOSxP Database Connection
router.get('/test-connection', async (req, res) => {
  try {
    const appointments = await getHosxpAppointments(5);
    res.json({
      status: 'success',
      message: '⚡ เชื่อมต่อฐานข้อมูล HOSxP สำเร็จ!',
      sampleAppointmentsCount: appointments.length,
      sampleAppointments: appointments,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: '❌ ไม่สามารถเชื่อมต่อฐานข้อมูล HOSxP ได้ โปรดตรวจสอบ IP, User, Password ใน .env.local',
      error: error.message,
    });
  }
});

// Search Patient by HN or CID in HOSxP `patient` table
router.get('/patients/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const patient = await getHosxpPatientByHnOrCid(query);
    if (!patient) {
      return res.status(404).json({ status: 'not_found', message: `ไม่พบข้อมูล HN/CID: ${query} ใน HOSxP` });
    }
    res.json({ status: 'success', patient });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Query Upcoming Appointments from HOSxP `oapp_moph_appointment_log`
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await getHosxpAppointments(50);
    res.json({ status: 'success', count: appointments.length, appointments });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
