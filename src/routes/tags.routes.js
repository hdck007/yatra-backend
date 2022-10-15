const express = require('express');
const { createTag, getTags } = require('../controllers/tags.controller');

const router = express.Router();

router.get('/', getTags);

router.post('/create', createTag);

module.exports = router;
