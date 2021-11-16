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
exports.addUser = (firstName, lastName, mail, hashedPass) => {

    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        // Use the connection
        connection.query("INSERT INTO users VALUES(NULL, '" + firstName + "', '" + lastName + "', '" + mail + "', '" + hashedPass + "');",
            function (error, results) {
            console.log(results)
            // When done with the connection, release it.
            connection.release();
            // Handle error after the release.
            if (error) throw error;

        });
    });
};

//FIXME Fonction pour récupérer le hash du mot de passe
exports.getCredentials =  (req, res, next) => {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        // Use the connection
        connection.query("SELECT Pass FROM users WHERE mail= '" + req.body.mail + "';",
            function (error, results) {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                res.locals.hashedPass = results
                next();
            })
    })

};
