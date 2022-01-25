const express = require("express"); //ExpressJS module
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
require("dotenv").config();

const mysql = require('mysql');
let pool  = mysql.createPool({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE,
    timezone: 'Europe/Paris',
    skipSetTimezone: true
});

//Add user to database

exports.addUser = (req, hashedPass) => {

    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        // Use the connection
        connection.query(`INSERT INTO users VALUES(NULL, ${pool.escape(req.body.firstName)}, ${pool.escape(req.body.lastName)}, ${pool.escape(req.body.mail)}, '${hashedPass}');`,
            function (error, results) {
                console.log(results);
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;

            });
    });
};

    exports.getCredentials =  (req, res, next) => {
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!

            // Use the connection
            connection.query(`SELECT Pass, PersonID FROM users WHERE mail = ${pool.escape(req.body.mail)};`,
                function (error, results) {
                    // When done with the connection, release it.
                    connection.release();
                    // Handle error after the release.
                    if (error) throw error;
                    res.locals.SQLResponse = results;
                    next();
                });
        });
    };


//Fonction qui ajoute un post à la base de données
    exports.addPostToDB = (req, res, next) => {
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!

            const imageUrl = `${req.protocol}://${req.get("host")}/public/images/posts/${req.file.filename}`;
            // Use the connection
            connection.query(`INSERT INTO posts VALUES (NULL, ${mysql.escape(req.body.title)}, '${imageUrl}', '${res.locals.PersonID}', NULL);`,
                function (error, results) {
                    // When done with the connection, release it.
                    connection.release();
                    // Handle error after the release.
                    if (error) throw error;
                    return results;
                });
        });
    };

exports.getPostsFromTo = (req, res, next) => {
    console.log(req.params.from); //FIXME: Pas possible d'acceder aux valeurs de req.query.from et req.query.to dans la fonction
    console.log(req.params.to);
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
    console.log(req.params.from);
    console.log(req.params.to);
        // Use the connection
        connection.query(`SELECT Title, Body, CreationDate, Prenom, Nom, PostID FROM posts p INNER JOIN users u ON p.Author=u.PersonID ORDER BY p.PostID DESC LIMIT ${req.params.from}, ${req.params.to};`,
            function (error, results) {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                res.locals.SQLResponse = results;
                next();
            });
    });
};



//Fonction qui ajoute un post à la base de données
exports.getPostFromDB = (req, res, next) => {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        // Use the connection
        connection.query(`SELECT Title, Body, CreationDate, Prenom, Nom, PostID FROM posts p INNER JOIN users u ON p.Author=u.PersonID ORDER BY p.PostID DESC;`,
            function (error, results) {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                res.locals.SQLResponse = results;
                next();
            });
    });
};


//Fonction qui ajoute un post à la base de données
exports.addCommentToDB = (req, res, next) => {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        // Use the connection
        connection.query(`INSERT INTO comments VALUES (NULL, ${res.locals.PersonID}, ${pool.escape(req.body.CommentBody)}, ${req.body.PostID}, NULL)`,
            function (error, results) {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                res.locals.SQLResponse = results;
                next();
            });
    });
};


//Middleware to get all comments for a post from database
exports.getCommentFromDB = (req, res, next) => {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        // Use the connection
        connection.query(`SELECT CommentBody, CreationDate, Prenom, Nom, CommentID FROM comments c INNER JOIN users u ON c.Author=u.PersonID  WHERE c.PostID = ${req.params.PostID};`,
            function (error, results) {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                res.locals.SQLResponse = results;
                next();
            });
    });
};

exports.getCommentsFromTo = (req, res, next) => {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        // Use the connection
        connection.query(`SELECT CommentBody, CreationDate, Prenom, Nom, CommentID FROM comments c INNER JOIN users u ON c.Author=u.PersonID  WHERE c.PostID = ${req.params.PostID} ORDER BY c.CommentID DESC LIMIT ${req.params.from}, ${req.params.to};`,
            function (error, results) {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                res.locals.SQLResponse = results;
                next();
            });
    });
};

//Fonction qui recupere l'id de l'auteur d'un commentaire et si l'ID correspond, supprimer le commentaire
exports.deleteCommentFromDB = (req, res, next) => {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        // Use the connection
        connection.query(`SELECT Author FROM comments WHERE CommentID = ${req.params.CommentID};`,
            function (error, results) {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                if (results[0].Author === res.locals.PersonID) {
                    pool.getConnection(function(err, connection) {
                        if (err) throw err; // not connected!
                        // Use the connection
                        connection.query(`DELETE FROM comments WHERE CommentID = ${req.params.CommentID};`,
                            function (error, results) {
                                // When done with the connection, release it.
                                connection.release();
                                // Handle error after the release.
                                if (error) throw error;
                                res.locals.SQLResponse = results;
                                next();
                            });
                    });
                } else {
                    res.locals.SQLResponse = "You are not the author of this comment ! You can't delete it.";
                    next();
                }
            });
    });
};

