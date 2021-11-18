const express = require("express");
const authMiddleware = require("../middlewares/auth.js");
const dbConnectMiddleware = require("../middlewares/dbConnect.js");
const postController = require("../controllers/post");

const router = express.Router();
router.get("/", authMiddleware.verifyToken, postController.getAllPost);
router.post("/", authMiddleware.verifyToken, postController.addPost);

module.exports = router;
