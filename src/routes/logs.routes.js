const express = require('express');
const {
  createLog, endLog, getLogs, getPlaces, getLogsByPlace, getLog, copyLog,
} = require('../controllers/logs.controller');

const router = express.Router();

// start log
router.post('/create', createLog);

router.get('/unique/:id', getLog);

// user log
router.get('/user', getLogs);

// end log
router.put('/end/:id', endLog);

// return places
router.get('/places', getPlaces);

router.get('/place/:name', getLogsByPlace);

router.post('/copy', copyLog);

module.exports = router;
