const jwt = require('jsonwebtoken');
const pool = require('../config/db');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function authorize(...roles) {
  return (req, res, next) => roles.includes(req.user.role)
    ? next()
    : res.status(403).json({ message: 'You do not have permission to perform this action' });
}

async function loadUser(req, res, next) {
  const result = await pool.query(
    'SELECT id, full_name, email, role, created_at, updated_at FROM users WHERE id = $1',
    [req.user.id]
  );
  if (!result.rows.length) return res.status(401).json({ message: 'User no longer exists' });
  req.userProfile = result.rows[0];
  next();
}

module.exports = { authenticate, authorize, loadUser };
