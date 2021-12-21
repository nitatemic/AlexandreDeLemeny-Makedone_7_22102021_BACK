const express = require("express"); //ExpressJS module
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
require("dotenv").config();

const mariadb = require('mariadb');
let pool  = mariadb.createPool({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE,
    timezone: 'Europe/Paris',
    skipSetTimezone: true
});

//Add user to database
exports.addUser = (req, hashedPass) => {
    pool.query(`INSERT INTO users VALUES(NULL, ${pool.escape(req.body.firstName)}, ${pool.escape(req.body.lastName)}, ${pool.escape(req.body.mail)}, '${hashedPass}')`, (err, results, metadata) => {
        if (err) {
            //handle error
        } else {
            console.log(results); //[ { 'NOW()': 2018-07-02T17:06:38.000Z }, meta: [ ... ] ]
        }

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
        connection.query(`INSERT INTO posts VALUES (NULL, '${pool.escape(req.body.title)}', '${imageUrl}', '${res.locals.PersonID}', NULL)`,
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

//Middleware qui recuperer les posts de la base de données entre le numéro X et Y
exports.getPostsFromTo = (req, res, next) => {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        // Use the connection
        connection.query(`SELECT * FROM posts ORDER BY PostID DESC LIMIT ${req.params.from}, ${req.params.to};`,
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

exports.getPostFromDB = (req, res, next) => {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        // Use the connection
        connection.query(`SELECT * FROM posts;`,
            function (error, results) {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                res.locals.allPost = results;
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
        connection.query(`SELECT * FROM comments WHERE PostID = ${req.body.postID};`,
            function (error, results) {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                res.locals.allComments = results;
                next();
            });
    });
};

