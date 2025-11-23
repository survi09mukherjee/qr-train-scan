const express = require('express');
const router = express.Router();
const { processScan } = require('../controllers/scanController');

router.post('/decode', processScan);

module.exports = router;
