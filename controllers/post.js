const dbConnectMiddleware = require('../middlewares/dbConnect');
require('dotenv').config();

// Fonction qui appel le middleware addPost pour ajouter un post à la BDD
exports.addPost = (req, res) => {
  // Attendre la réponse de la fonction addPostToDB pour renvoyer le résultat
  dbConnectMiddleware.addPostToDB(req, res, () => {
    res.status(201).json({
      message: 'Post added',
      post: res.locals.SQLResponse[0],
    });
  });
};

// Fonction qui récupère les posts passés en paramètre
exports.getAllPost = (req, res, next) => {
  next();
};

// Fonction qui supprime un commentaire
exports.deletePost = (req, res) => {
  res.status(204).json({
    message: 'Post deleted!',
  });
};
