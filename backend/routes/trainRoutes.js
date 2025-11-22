const express = require('express');
const router = express.Router();
const { getAllTrains, getTrain, searchTrains } = require('../controllers/trainController');

router.get('/', getAllTrains);
router.get('/search', searchTrains);
router.get('/:trainNumber', getTrain);

module.exports = router;
