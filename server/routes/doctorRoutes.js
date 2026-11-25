const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { listPatients, patientReadings, patientReport } = require('../controllers/doctorController');

router.use(authenticate, authorize('doctor'));
router.get('/patients', listPatients);
router.get('/patients/:patientId/readings', patientReadings);
router.get('/patients/:patientId/reports/daily', (req, res, next) => { req.params.type = 'daily'; patientReport(req, res, next); });
router.get('/patients/:patientId/reports/month-to-date', (req, res, next) => { req.params.type = 'month-to-date'; patientReport(req, res, next); });
router.get('/patients/:patientId/reports/previous-month', (req, res, next) => { req.params.type = 'previous-month'; patientReport(req, res, next); });

module.exports = router;
