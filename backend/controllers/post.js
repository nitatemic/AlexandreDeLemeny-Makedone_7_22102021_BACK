const dbConnectMiddleware = require("../middlewares/dbConnect.js");
require("dotenv").config();


//Fonction qui appel le middleware addPost pour ajouter un post à la base de données
exports.addPost = (req, res, next) => {
    console.log(req.file);
    console.log(req.body.title);
    dbConnectMiddleware.addPostToDB(req, res, next);
};



//Fonction qui récupère les posts passés en paramètre
exports.getAllPost = (req, res) => {
    const allPosts = res.locals.SQLResponse;
};
