const express = require("express");
const authMiddleware = require("../middlewares/auth.js");
const dbConnectMiddleware = require("../middlewares/dbConnect.js");
const commentController = require("../controllers/comment.js");


const router = express.Router();
router.get("/", dbConnectMiddleware.getCommentFromDB, commentController.getAllComment);
router.post("/", authMiddleware.verifyToken, commentController.addComment);
router.get("/:from/:to", dbConnectMiddleware.getCommentsFromTo, commentController.getAllComment); //Route get pour envoyer les comment du numéro X à Y
module.exports = router;

