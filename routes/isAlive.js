const express = require('express');
const isAliveCtrl = require('../controllers/isAlive');

const router = express.Router();
router.get('/', isAliveCtrl.isAlive);
module.exports = router;
