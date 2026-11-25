const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { createReading, listReadings, getReading, updateReading, deleteReading } = require('../controllers/readingController');

router.use(authenticate, authorize('patient'));
router.post('/', createReading);
router.get('/', listReadings);
router.get('/:id', getReading);
router.put('/:id', updateReading);
router.delete('/:id', deleteReading);

module.exports = router;
