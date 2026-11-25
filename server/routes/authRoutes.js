const router = require('express').Router();
const { register, login, logout } = require('../controllers/authController');
const { authenticate, loadUser } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, loadUser, (req, res) => res.json({ user: req.userProfile }));

module.exports = router;
