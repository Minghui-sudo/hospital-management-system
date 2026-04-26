const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const {
  getAllUsers,
  deleteUser,
  getAllAppointments,
  getAuditLog
} = require('../controllers/adminController');

router.get('/users', verifyToken, verifyRole('admin'), getAllUsers);
router.delete('/users/:id', verifyToken, verifyRole('admin'), deleteUser);
router.get('/appointments', verifyToken, verifyRole('admin'), getAllAppointments);
router.get('/audit-log', verifyToken, verifyRole('admin'), getAuditLog);

module.exports = router;