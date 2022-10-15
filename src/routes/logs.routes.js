const express = require('express');
const { createLog, endLog } = require('../controllers/logs.controller');

const router = express.Router();

// start log
router.post('/create', createLog);

// end log
router.put('/end/:id', endLog);

module.exports = router;
