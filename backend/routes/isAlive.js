const isAliveCtrl = require("../controllers/isAlive.js");
const express = require("express");

const router = express.Router();
router.get("/", isAliveCtrl.isAlive);
module.exports = router;
