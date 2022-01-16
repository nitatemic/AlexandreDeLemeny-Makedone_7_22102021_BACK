const express = require("express");
const authMiddleware = require("../middlewares/auth.js");
const dbConnectMiddleware = require("../middlewares/dbConnect.js");
const commentController = require("../controllers/comment.js");


const router = express.Router();
router.get("/:PostID", authMiddleware.verifyToken, dbConnectMiddleware.getCommentFromDB, commentController.getAllComment);
router.post("/", authMiddleware.verifyToken, commentController.addComment);
router.get("/:PostID/:from/:to", authMiddleware.verifyToken, dbConnectMiddleware.getCommentsFromTo, commentController.getAllComment); //Route get pour envoyer les comment du numéro X à Y
router.delete("/:CommentID", authMiddleware.verifyToken, dbConnectMiddleware.deleteCommentFromDB, commentController.deleteComment);
module.exports = router;
