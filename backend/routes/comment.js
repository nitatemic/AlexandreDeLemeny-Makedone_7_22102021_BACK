const express = require("express");
const authMiddleware = require("../middlewares/auth.js");
const dbConnectMiddleware = require("../middlewares/dbConnect.js");
const commentController = require("../controllers/comment.js");


const router = express.Router();
router.get("/", authMiddleware.verifyToken, dbConnectMiddleware.getCommentFromDB, commentController.getAllComment);
router.post("/", authMiddleware.verifyToken, commentController.getAllComment);

module.exports = router;
