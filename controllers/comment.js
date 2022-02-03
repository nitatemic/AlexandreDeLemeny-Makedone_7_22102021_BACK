const dbConnectMiddleware = require('../middlewares/dbConnect');
require('dotenv').config();

// Fonction appel le middleware addComment pour ajouter un commentaire à la BBD
exports.addComment = (req, res, next) => {
  dbConnectMiddleware.addCommentToDB(req, res, next);
  res.status(201).json({
    message: 'Comment added!',
  });
};

// Fonction qui récupère les posts passés en paramètre
exports.getAllComment = (req, res) => {
  res.status(200).json({
    message: 'Comments fetched!',
    comments: res.locals.SQLResponse,
  });
};

// Fonction qui supprime un commentaire
exports.deleteComment = (req, res) => {
  res.status(204).json({
    message: 'Comment deleted!',
  });
};
