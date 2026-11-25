const pool = require('../config/db');
const { getReport } = require('../services/reportService');

async function ensureAssignment(doctorId, patientId) {
  const result = await pool.query(
    'SELECT 1 FROM doctor_patient_assignments WHERE doctor_id = $1 AND patient_id = $2',
    [doctorId, patientId]
  );
  return result.rows.length > 0;
}

async function listPatients(req, res) {
  const result = await pool.query(
    `SELECT u.id, u.full_name, u.email, u.created_at
     FROM doctor_patient_assignments a
     JOIN users u ON u.id = a.patient_id
     WHERE a.doctor_id = $1
     ORDER BY u.full_name`,
    [req.user.id]
  );
  res.json({ patients: result.rows });
}

async function patientReadings(req, res) {
  if (!(await ensureAssignment(req.user.id, req.params.patientId))) {
    return res.status(403).json({ message: 'This patient is not assigned to you.' });
  }
  const result = await pool.query(
    'SELECT * FROM glucose_readings WHERE patient_id = $1 ORDER BY reading_date DESC',
    [req.params.patientId]
  );
  res.json({ readings: result.rows });
}

async function patientReport(req, res) {
  if (!(await ensureAssignment(req.user.id, req.params.patientId))) {
    return res.status(403).json({ message: 'This patient is not assigned to you.' });
  }
  const data = await getReport(req.params.patientId, req.params.type, req.query.date);
  res.json(data);
}

module.exports = { listPatients, patientReadings, patientReport };
