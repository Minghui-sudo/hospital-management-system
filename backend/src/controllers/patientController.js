const pool = require('../config/db');

const getMyProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.created_at,
              p.date_of_birth, p.phone, p.address, p.blood_type
       FROM users u
       JOIN patients p ON u.id = p.user_id
       WHERE u.id = $1`,
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const updateMyProfile = async (req, res) => {
  const { phone, address, date_of_birth, blood_type } = req.body;
  try {
    await pool.query(
      `UPDATE patients SET phone=$1, address=$2, date_of_birth=$3, blood_type=$4
       WHERE user_id=$5`,
      [phone, address, date_of_birth, blood_type, req.user.id]
    );
    await pool.query(
      'INSERT INTO audit_log (user_id, action) VALUES ($1, $2)',
      [req.user.id, 'Patient updated profile']
    );
    res.json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.appointment_date, a.status, a.notes,
              u.name as doctor_name, d.specialization
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE p.user_id = $1
       ORDER BY a.appointment_date DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const bookAppointment = async (req, res) => {
  const { doctor_id, appointment_date, notes } = req.body;
  try {
    const patientResult = await pool.query(
      'SELECT id FROM patients WHERE user_id = $1', [req.user.id]
    );
    const patient_id = patientResult.rows[0].id;

    await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, notes)
       VALUES ($1, $2, $3, $4)`,
      [patient_id, doctor_id, appointment_date, notes]
    );
    await pool.query(
      'INSERT INTO audit_log (user_id, action) VALUES ($1, $2)',
      [req.user.id, 'Patient booked appointment']
    );
    res.status(201).json({ message: 'Appointment booked successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getMyProfile, updateMyProfile, getMyAppointments, bookAppointment };