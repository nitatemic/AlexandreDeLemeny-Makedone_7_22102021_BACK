const userCtrl = require("../controllers/user.js");
const express = require("express");
const authMiddleware = require("../middlewares/auth.js");

const router = express.Router();
router.post("/signup", authMiddleware.AllFieldsCompleted ,authMiddleware.checkMail, userCtrl.createUser);
router.post("/login", authMiddleware.checkMail, userCtrl.login);
module.exports = router;
