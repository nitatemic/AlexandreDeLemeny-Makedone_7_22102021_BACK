const dbConnectMiddleware = require("../middlewares/dbConnect.js");
require("dotenv").config();


//Fonction qui appel le middleware addPost pour ajouter un post à la base de données
exports.addPost = (req, res, next) => {
    dbConnectMiddleware.addPostToDB(req, res, next);
};



//Fonction qui recupère les posts passés en parametre
exports.getAllPost = (req, res) => {
    const allPosts = res.locals.SQLResponse
};
