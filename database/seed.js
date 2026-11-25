require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const pool = require('../server/config/db');

async function seed() {
  const patientHash = await bcrypt.hash('Patient123!', 10);
  const doctorHash = await bcrypt.hash('Doctor123!', 10);
  await pool.query(`
    INSERT INTO users (full_name, email, password_hash, role)
    VALUES ('Demo Patient', 'patient@sweety.app', $1, 'patient'),
           ('Dr. Demo', 'doctor@sweety.app', $2, 'doctor')
    ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
  `, [patientHash, doctorHash]);

  const patient = await pool.query("SELECT id FROM users WHERE email = 'patient@sweety.app'");
  const doctor = await pool.query("SELECT id FROM users WHERE email = 'doctor@sweety.app'");
  await pool.query(`
    INSERT INTO doctor_patient_assignments (doctor_id, patient_id)
    VALUES ($1, $2) ON CONFLICT DO NOTHING
  `, [doctor.rows[0].id, patient.rows[0].id]);

  const dates = [
    [0, 'Morning (fasting)', 98], [0, 'After breakfast', 142],
    [-1, 'After lunch', 156], [-2, 'After dinner', 128],
    [-5, 'Morning (fasting)', 92], [-20, 'After breakfast', 137]
  ];
  for (const [offset, slot, value] of dates) {
    await pool.query(`
      INSERT INTO glucose_readings (patient_id, reading_date, time_slot, glucose_value)
      VALUES ($1, CURRENT_DATE + ($2 * INTERVAL '1 day'), $3, $4)
      ON CONFLICT (patient_id, reading_date, time_slot) DO NOTHING
    `, [patient.rows[0].id, offset, slot, value]);
  }
  console.log('Seed complete');
  await pool.end();
}

seed().catch(async error => { console.error(error); await pool.end(); process.exit(1); });
