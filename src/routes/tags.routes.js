const express = require('express');
const { createTag } = require('../controllers/tags.controller');

const router = express.Router();

router.post('/create', createTag);

module.exports = router;
