const pool = require('../config/db');

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM audit_log WHERE user_id = $1', [id]);
    
    const patientResult = await pool.query('SELECT id FROM patients WHERE user_id = $1', [id]);
    if (patientResult.rows.length > 0) {
      const patientId = patientResult.rows[0].id;
      await pool.query('DELETE FROM medical_records WHERE patient_id = $1', [patientId]);
      await pool.query('DELETE FROM appointments WHERE patient_id = $1', [patientId]);
      await pool.query('DELETE FROM patients WHERE id = $1', [patientId]);
    }

    const doctorResult = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [id]);
    if (doctorResult.rows.length > 0) {
      const doctorId = doctorResult.rows[0].id;
      await pool.query('DELETE FROM medical_records WHERE doctor_id = $1', [doctorId]);
      await pool.query('DELETE FROM appointments WHERE doctor_id = $1', [doctorId]);
      await pool.query('DELETE FROM doctors WHERE id = $1', [doctorId]);
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.appointment_date, a.status, a.notes,
              up.name as patient_name, ud.name as doctor_name
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN users up ON p.user_id = up.id
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users ud ON d.user_id = ud.id
       ORDER BY a.appointment_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getAuditLog = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT al.id, al.action, al.timestamp, u.name, u.email
       FROM audit_log al
       JOIN users u ON al.user_id = u.id
       ORDER BY al.timestamp DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getAllUsers, deleteUser, getAllAppointments, getAuditLog };