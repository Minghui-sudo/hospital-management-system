const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const {
  getMyPatients,
  getMyAppointments,
  updateAppointmentStatus,
  addMedicalRecord
} = require('../controllers/doctorController');

router.get('/patients', verifyToken, verifyRole('doctor'), getMyPatients);
router.get('/appointments', verifyToken, verifyRole('doctor'), getMyAppointments);
router.put('/appointments/:id', verifyToken, verifyRole('doctor'), updateAppointmentStatus);
router.post('/records', verifyToken, verifyRole('doctor'), addMedicalRecord);

module.exports = router;