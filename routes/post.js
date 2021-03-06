const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middlewares/auth');
const dbConnectMiddleware = require('../middlewares/dbConnect');
const postController = require('../controllers/post');
const userCtrl = require('../controllers/user');

// Intercepter un fichier dans la requête est le stocker dans un dossier
// On utilise multer pour filtrer les fichiers qui ne sont pas des images
const upload = multer({
  dest: './public/images/posts',
  fileFilter(req, file, cb) {
    console.log(file);
    if (!file.originalname.match(/\.(gif|jpeg|png|jpg)$/)) {
      return cb(new Error('Please upload an image'));
    }
    cb(undefined, true);
  },
});

const router = express.Router();
router.get('/', authMiddleware.verifyToken, dbConnectMiddleware.getPostFromDB, postController.getAllPost, userCtrl.refreshToken);
router.post('/', authMiddleware.verifyToken, upload.single('image'), postController.addPost);
router.get('/:from/:to', authMiddleware.verifyToken, dbConnectMiddleware.getPostsFromTo, postController.getAllPost, userCtrl.refreshToken); // Route get pour envoyer les posts du numéro X à Y
router.delete('/:PostID', authMiddleware.verifyToken, dbConnectMiddleware.deletePostFromDB, postController.deletePost);
module.exports = router;
