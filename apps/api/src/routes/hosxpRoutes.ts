import { Router } from 'express';
import {
  getHosxpPatientByHnOrCid,
  getHosxpPatientList,
  getHosxpPatientMedicalHistory,
  getHosxpAppointments,
} from '../services/hosxpService.js';

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
      message: '❌ ไม่สามารถเชื่อมต่อฐานข้อมูล HOSxP ได้',
      error: error.message,
    });
  }
});

// Get Paginated Patient List directly from HOSxP `patient` table
router.get('/patients-list', async (req, res) => {
  try {
    const search = String(req.query.search || '');
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const data = await getHosxpPatientList(search, page, limit);
    res.json({ status: 'success', ...data });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
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

// Get Medical Treatment History for a specific patient from HOSxP (`ovst` + `opdscreen` + `vn_stat`)
router.get('/patients/:hn/history', async (req, res) => {
  try {
    const { hn } = req.params;
    const history = await getHosxpPatientMedicalHistory(hn);
    res.json({ status: 'success', hn, historyCount: history.length, history });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Query Upcoming Appointments from HOSxP `oapp`
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await getHosxpAppointments(50);
    res.json({ status: 'success', count: appointments.length, appointments });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
