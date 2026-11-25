const pool = require('../config/db');
const { validateReading } = require('../validators/readingValidator');

async function createReading(req, res) {
  const errors = validateReading(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please correct the form.', errors });
  const { reading_date, time_slot, glucose_value } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1 || '|' || $2::text))", [req.user.id, reading_date]);
    const count = await client.query(
      'SELECT COUNT(*)::int AS count FROM glucose_readings WHERE patient_id = $1 AND reading_date = $2',
      [req.user.id, reading_date]
    );
    if (count.rows[0].count >= 4) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'You can add only 4 readings per day.' });
    }
    const result = await client.query(
      `INSERT INTO glucose_readings (patient_id, reading_date, time_slot, glucose_value)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, reading_date, time_slot, Number(glucose_value)]
    );
    await client.query('COMMIT');
    res.status(201).json({ message: 'Reading added successfully.', reading: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') return res.status(409).json({ message: 'You already have a reading for this time slot.' });
    throw error;
  } finally {
    client.release();
  }
}

async function listReadings(req, res) {
  const result = await pool.query(
    `SELECT * FROM glucose_readings WHERE patient_id = $1
     ORDER BY reading_date DESC,
       CASE time_slot WHEN 'Morning (fasting)' THEN 1 WHEN 'After breakfast' THEN 2
       WHEN 'After lunch' THEN 3 ELSE 4 END`,
    [req.user.id]
  );
  res.json({ readings: result.rows });
}

async function getReading(req, res) {
  const result = await pool.query('SELECT * FROM glucose_readings WHERE id = $1 AND patient_id = $2', [req.params.id, req.user.id]);
  if (!result.rows.length) return res.status(404).json({ message: 'Reading not found.' });
  res.json({ reading: result.rows[0] });
}

async function updateReading(req, res) {
  const errors = validateReading(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please correct the form.', errors });
  const { reading_date, time_slot, glucose_value } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1 || '|' || $2::text))", [req.user.id, reading_date]);
    const existing = await client.query('SELECT * FROM glucose_readings WHERE id = $1 AND patient_id = $2', [req.params.id, req.user.id]);
    if (!existing.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Reading not found.' });
    }
    if (existing.rows[0].reading_date.toISOString().slice(0, 10) !== reading_date || existing.rows[0].time_slot !== time_slot) {
      const count = await client.query(
        'SELECT COUNT(*)::int AS count FROM glucose_readings WHERE patient_id = $1 AND reading_date = $2',
        [req.user.id, reading_date]
      );
      if (count.rows[0].count >= 4) {
        await client.query('ROLLBACK');
        return res.status(409).json({ message: 'You can add only 4 readings per day.' });
      }
    }
    const result = await client.query(
      `UPDATE glucose_readings SET reading_date = $1, time_slot = $2, glucose_value = $3, updated_at = NOW()
       WHERE id = $4 AND patient_id = $5 RETURNING *`,
      [reading_date, time_slot, Number(glucose_value), req.params.id, req.user.id]
    );
    await client.query('COMMIT');
    res.json({ message: 'Reading updated successfully.', reading: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') return res.status(409).json({ message: 'You already have a reading for this time slot.' });
    throw error;
  } finally {
    client.release();
  }
}

async function deleteReading(req, res) {
  const result = await pool.query('DELETE FROM glucose_readings WHERE id = $1 AND patient_id = $2 RETURNING id', [req.params.id, req.user.id]);
  if (!result.rows.length) return res.status(404).json({ message: 'Reading not found.' });
  res.json({ message: 'Reading deleted successfully.' });
}

module.exports = { createReading, listReadings, getReading, updateReading, deleteReading };
