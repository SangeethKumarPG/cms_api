const express = require('express');
const router = express.Router();
const { createSite } = require('../controllers/siteController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createSite);

module.exports = router;