const express = require('express');
const router = express.Router();
const { getAllTrains, getTrain, searchTrains } = require('../controllers/trainController');
const { getLiveTrainData } = require('../controllers/liveTrainController');

router.get('/', getAllTrains);
router.get('/search', searchTrains);
router.get('/searchByLocation', searchTrains);
router.get('/:trainNumber/live', getLiveTrainData);
router.get('/:trainNumber', getTrain);

module.exports = router;
