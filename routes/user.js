const express = require('express');
const userCtrl = require('../controllers/user');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
router.post('/signup', authMiddleware.AllFieldsCompleted, authMiddleware.checkMail, userCtrl.createUser);
router.post('/login', authMiddleware.AllFieldsCompletedForLogin, authMiddleware.checkMail, userCtrl.login);

module.exports = router;
