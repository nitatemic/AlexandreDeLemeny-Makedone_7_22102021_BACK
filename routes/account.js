const express = require('express');
const authMiddleware = require('../middlewares/auth');
const dbConnectMiddleware = require('../middlewares/dbConnect');
const accountCtrl = require('../controllers/account');

const router = express.Router();
router.get('/', authMiddleware.verifyToken, dbConnectMiddleware.getUserInfo, accountCtrl.getUserInfos);
router.post('/', authMiddleware.verifyToken, dbConnectMiddleware.getPasswordHash, accountCtrl.updatePassword);
router.post('/delete', authMiddleware.verifyToken, accountCtrl.deleteAccount);
module.exports = router;
