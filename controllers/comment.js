const dbConnectMiddleware = require('../middlewares/dbConnect');

// Fonction appel le middleware addComment pour ajouter un commentaire à la BBD
exports.addComment = (req, res) => {
  // Vérifier que tous les champs sont remplis
  if (!req.body.CommentBody || !req.body.PostID) {
    return res.status(400).send({
      message: 'Veuillez remplir tout les champs',
    });
  }

  dbConnectMiddleware.addCommentToDB(req, res, () => {
    if (res.statusCode === 500) {
      res.status(500).json({
        error: 'Erreur lors de l\'ajout du commentaire',
      });
    } else {

      res.status(201).json({
        message: 'Commentaire ajouté',
        comment: res.locals.SQLResponse[0],
      });
    }
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
