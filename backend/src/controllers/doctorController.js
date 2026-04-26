const pool = require('../config/db');

const getMyPatients = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT p.id as patient_id, u.id as user_id, u.name, u.email, 
              p.date_of_birth, p.phone, p.blood_type
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN users u ON p.user_id = u.id
       JOIN doctors d ON a.doctor_id = d.id
       WHERE d.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.appointment_date, a.status, a.notes,
              u.name as patient_name, p.blood_type, p.phone
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN users u ON p.user_id = u.id
       JOIN doctors d ON a.doctor_id = d.id
       WHERE d.user_id = $1
       ORDER BY a.appointment_date DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query(
      'UPDATE appointments SET status=$1 WHERE id=$2',
      [status, id]
    );
    await pool.query(
      'INSERT INTO audit_log (user_id, action) VALUES ($1, $2)',
      [req.user.id, `Doctor updated appointment ${id} to ${status}`]
    );
    res.json({ message: 'Appointment status updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const addMedicalRecord = async (req, res) => {
  const { patient_id, diagnosis, prescription } = req.body;
  try {
    const doctorResult = await pool.query(
      'SELECT id FROM doctors WHERE user_id = $1', [req.user.id]
    );
    const doctor_id = doctorResult.rows[0].id;

    await pool.query(
      `INSERT INTO medical_records (patient_id, doctor_id, diagnosis, prescription)
       VALUES ($1, $2, $3, $4)`,
      [patient_id, doctor_id, diagnosis, prescription]
    );
    await pool.query(
      'INSERT INTO audit_log (user_id, action) VALUES ($1, $2)',
      [req.user.id, `Doctor added medical record for patient ${patient_id}`]
    );
    res.status(201).json({ message: 'Medical record added successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getMyPatients, getMyAppointments, updateAppointmentStatus, addMedicalRecord };