const dbConnectMiddleware = require("../middlewares/dbConnect.js");
require("dotenv").config();


//Fonction qui appel le middleware addPost pour ajouter un post à la base de données
exports.addPost = (req, res, next) => {
    console.log(req.file);
    console.log(req.body.title);
    dbConnectMiddleware.addPostToDB(req, res, next);
    res.status(201).json({
        message: "Post added!",
    });
};




//Fonction qui récupère les posts passés en paramètre
//TODO : Renvoyer les correspondances des ID des auteurs en même temps
exports.getAllPost = (req, res) => {
    res.status(200).json({
        message: "Posts fetched!",
        posts: res.locals.allPost,
    });
};
