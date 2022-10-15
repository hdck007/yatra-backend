const express = require('express');
const {
  createLog, endLog, getLogs, getPlaces,
} = require('../controllers/logs.controller');

const router = express.Router();

// start log
router.post('/create', createLog);

// user log
router.get('/user', getLogs);

// end log
router.put('/end/:id', endLog);

// return places
router.get('/places', getPlaces);

module.exports = router;
