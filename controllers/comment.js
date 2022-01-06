const dbConnectMiddleware = require("../middlewares/dbConnect.js");
require("dotenv").config();

//Fonction qui appel le middleware addComment pour ajouter un commentaire à la base de données
exports.addComment = (req, res, next) => {
    dbConnectMiddleware.addCommentToDB(req, res, next);
    res.status(201).json({
        message: "Comment added!",
    });
};

//Fonction qui récupère les posts passés en paramètre
exports.getAllComment = (req, res) => {
    res.status(200).json({
        message: "Comments fetched!",
        comments: res.locals.SQLResponse,
    });
};

//Fonction qui supprime un commentaire
exports.deleteComment = (req, res) => {
        res.status(200).json({
            message: "Comment deleted!",
        });
};
