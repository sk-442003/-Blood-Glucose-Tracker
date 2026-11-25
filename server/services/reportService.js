const pool = require('../config/db');

function validateDate(date) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

function ranges(type, date) {
  if (!validateDate(date)) throw Object.assign(new Error('A valid date is required.'), { status: 400 });
  if (type === 'daily') return { start: date, end: date };
  if (type === 'month-to-date') return { start: `${date.slice(0, 7)}-01`, end: date };
  const first = new Date(`${date.slice(0, 7)}-01T00:00:00Z`);
  first.setUTCMonth(first.getUTCMonth() - 1);
  const start = first.toISOString().slice(0, 10);
  const next = new Date(first);
  next.setUTCMonth(next.getUTCMonth() + 1);
  next.setUTCDate(0);
  return { start, end: next.toISOString().slice(0, 10) };
}

async function getReport(patientId, type, date) {
  const { start, end } = ranges(type, date);
  const result = await pool.query(
    `SELECT id, patient_id, reading_date, time_slot, glucose_value, created_at, updated_at
     FROM glucose_readings
     WHERE patient_id = $1 AND reading_date BETWEEN $2::date AND $3::date
     ORDER BY reading_date, CASE time_slot
       WHEN 'Morning (fasting)' THEN 1 WHEN 'After breakfast' THEN 2
       WHEN 'After lunch' THEN 3 ELSE 4 END`,
    [patientId, start, end]
  );
  const readings = result.rows;
  const values = readings.map(r => r.glucose_value);
  const statistics = {
    highest: values.length ? Math.max(...values) : null,
    lowest: values.length ? Math.min(...values) : null,
    average: values.length ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)) : null,
    total: values.length
  };
  return { range: { start, end }, statistics, readings };
}

module.exports = { getReport, ranges };
