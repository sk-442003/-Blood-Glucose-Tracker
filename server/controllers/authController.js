const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

function tokenFor(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
}

async function register(req, res) {
  const { full_name, email, password, confirm_password } = req.body;
  const errors = {};
  if (!full_name?.trim()) errors.full_name = 'Full name is required.';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (!password || password.length < 8) errors.password = 'Password must be at least 8 characters.';
  if (password !== confirm_password) errors.confirm_password = 'Passwords must match.';
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please correct the form.', errors });
  const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
  if (existing.rows.length) return res.status(409).json({ message: 'An account with this email already exists.' });
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, LOWER($2), $3, 'patient')
     RETURNING id, full_name, email, role, created_at, updated_at`,
    [full_name.trim(), email.trim(), passwordHash]
  );
  const user = result.rows[0];
  res.status(201).json({ message: 'Registration successful', token: tokenFor(user), user });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
  const result = await pool.query(
    'SELECT id, full_name, email, password_hash, role, created_at, updated_at FROM users WHERE LOWER(email) = LOWER($1)',
    [email.trim()]
  );
  if (!result.rows.length) return res.status(401).json({ message: 'Invalid email or password.' });
  const user = result.rows[0];
  if (!(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  const { password_hash, ...safeUser } = user;
  res.json({ message: 'Login successful', token: tokenFor(user), user: safeUser });
}

function logout(req, res) {
  res.json({ message: 'Logged out successfully' });
}

module.exports = { register, login, logout };
