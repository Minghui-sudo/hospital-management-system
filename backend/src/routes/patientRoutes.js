const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const {
  getMyProfile,
  updateMyProfile,
  getMyAppointments,
  bookAppointment
} = require('../controllers/patientController');

router.get('/profile', verifyToken, verifyRole('patient'), getMyProfile);
router.put('/profile', verifyToken, verifyRole('patient'), updateMyProfile);
router.get('/appointments', verifyToken, verifyRole('patient'), getMyAppointments);
router.post('/appointments', verifyToken, verifyRole('patient'), bookAppointment);

router.get('/doctors', verifyToken, verifyRole('patient'), async (req, res) => {
  const pool = require('../config/db');
  try {
    const result = await pool.query(
      `SELECT d.id, u.name, d.specialization, d.phone
       FROM doctors d JOIN users u ON d.user_id = u.id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.put('/appointments/:id/cancel', verifyToken, verifyRole('patient'), async (req, res) => {
  const pool = require('../config/db');
  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE appointments SET status=$1 WHERE id=$2',
      ['cancelled', id]
    );
    await pool.query(
      'INSERT INTO audit_log (user_id, action) VALUES ($1, $2)',
      [req.user.id, `Patient cancelled appointment ${id}`]
    );
    res.json({ message: 'Appointment cancelled.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/records', verifyToken, verifyRole('patient'), async (req, res) => {
  const pool = require('../config/db');
  try {
    const result = await pool.query(
      `SELECT mr.id, mr.diagnosis, mr.prescription, mr.record_date,
              u.name as doctor_name, d.specialization
       FROM medical_records mr
       JOIN doctors d ON mr.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       JOIN patients p ON mr.patient_id = p.id
       WHERE p.user_id = $1
       ORDER BY mr.record_date DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;