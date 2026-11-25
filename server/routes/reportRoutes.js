const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { report } = require('../controllers/reportController');

router.use(authenticate, authorize('patient'));
router.get('/daily', (req, res, next) => { req.params.type = 'daily'; report(req, res, next); });
router.get('/month-to-date', (req, res, next) => { req.params.type = 'month-to-date'; report(req, res, next); });
router.get('/previous-month', (req, res, next) => { req.params.type = 'previous-month'; report(req, res, next); });

module.exports = router;
