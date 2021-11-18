const express = require("express"); //ExpressJS module
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
require("dotenv").config();

let mysql = require('mysql');
let pool  = mysql.createPool({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE
});

//Add user to database
exports.addUser = (req, hashedPass) => {

    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        // Use the connection
        connection.query("INSERT INTO users VALUES(NULL, '" + req.body.firstName + "', '" + req.body.lastName + "', '" + req.body.mail + "', '" + hashedPass + "');",
            function (error, results) {
            console.log(results)
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
        connection.query("SELECT Pass, PersonID FROM users WHERE mail= '" + req.body.mail + "';",
            function (error, results) {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                res.locals.SQLResponse = results
                next();
            })
    })
};

exports.sendPostToDB =  (title, body, author, next) => {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        // Use the connection
        connection.query("INSERT INTO posts VALUES(NULL, '" + title + "', '" + body + "', '" + author + "', NULL );",
            function (error, results) {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                res.locals.SQLResponse = results
                next();
            })
    })
};
