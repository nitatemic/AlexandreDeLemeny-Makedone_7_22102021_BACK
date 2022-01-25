const dbConnectMiddleware = require('../middlewares/dbConnect');
require('dotenv').config();

// Fonction qui appel le middleware addPost pour ajouter un post à la BDD
exports.addPost = (req, res, next) => {
  dbConnectMiddleware.addPostToDB(req, res, next);
  res.status(201).json({
    message: 'Post added!',
  });
};

// Fonction qui récupère les posts passés en paramètre
exports.getAllPost = (req, res, next) => {
  next();
};
