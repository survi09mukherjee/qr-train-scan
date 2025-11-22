const express = require('express');
const router = express.Router();
const { processScan } = require('../controllers/scanController');

router.post('/', processScan);

module.exports = router;
