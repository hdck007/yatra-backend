const express = require('express');
const { createEvent, getFeed } = require('../controllers/events.controller');

const router = express.Router();

router.get('/', getFeed);

// start log
router.post('/create', createEvent);

module.exports = router;
