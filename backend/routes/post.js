const express = require("express");
const authMiddleware = require("../middlewares/auth.js");
const dbConnectMiddleware = require("../middlewares/dbConnect.js");

const router = express.Router();
router.get("/", authMiddleware.verifyToken, );

module.exports = router;
