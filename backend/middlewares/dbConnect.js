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

exports.getCredentials = async (mail) => {
    let hash;
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        // Use the connection
        connection.query("SELECT Pass FROM users WHERE mail= '" + mail + "';",
            function (error, results) {
            console.log(results); //Si j'enlève le console.log ça ne fonctionne plus. Donc PAS TOUCHE
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                hash = results;
            });
    });
    return await hash;
};

