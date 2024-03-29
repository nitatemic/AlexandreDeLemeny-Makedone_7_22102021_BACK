const express = require('express');
// ExpressJS module
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
require('dotenv').config();

const mysql = require('mysql');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  timezone: 'Europe/Paris',
  skipSetTimezone: true,
});

// Add user to database

exports.addUser = (req, res, hashedPass, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    // Use the connection
    try {
      connection.query(
          `INSERT INTO users VALUES(NULL, ${pool.escape(req.body.firstName)}, ${pool.escape(req.body.lastName)}, ${pool.escape(req.body.mail)}, '${hashedPass}', 0 );`,
          (error, results) => {
            if(error){
            if(error.code === 'ER_DUP_ENTRY' || error.errno === 1062)
            {
              res.statusCode = 400;
              connection.release();
              next();
            }
            else{
              console.log('Other error in the query')
              res.statusCode = 500;
              connection.release();
              next();
            }
          } else{
            console.log('No error in the query')
            res.statusCode = 200;
            connection.release();
            next();
          }
          })
    }
    catch (error) {
      console.log(error);
      next();
    }
  });
};

exports.getCredentials = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    // Use the connection
    connection.query(
      `SELECT Pass, PersonID, IsAdmin FROM users WHERE mail = ${pool.escape(req.body.mail)};`,
      (error, results) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        res.locals.SQLResponse = results;
        next();
      });
  });
};

// Fonction qui ajoute un post à la base de données
exports.addPostToDB = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    const imageUrl = `${req.protocol}://${req.get('host')}/public/images/posts/${req.file.filename}`;
    // Use the connection
    // eslint-disable-next-line max-len
    connection.query(
      `INSERT INTO posts
       VALUES (NULL, ${mysql.escape(req.body.title)}, '${imageUrl}', '${res.locals.PersonID}',
               NULL);`,
      (error, results) => {
        if (error) throw error;
        // When done with the connection, release it.
        let postID = results.insertId;
        console.log(postID)
        connection.query(
          `SELECT Title, Body, CreationDate, Prenom, Nom, PostID, PersonID
           FROM posts p
                    INNER JOIN users u ON p.Author = u.PersonID
           WHERE p.PostID = ${postID}
           LIMIT 1;`,
          (error, results) => {
            console.log(results);
            // When done with the connection, release it.
            connection.release();
            // Handle error after the release.
            if (error) throw error;
            //Renvoyer le résultat à la fonction qui a appelé la fonction
            res.locals.SQLResponse = results;
            next();
          },
        );
      },
    );
  })
};

exports.getPostsFromTo = (req, res, next) => {
  console.log(req.params.from);
  console.log(req.params.to);
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log(req.params.from);
    console.log(req.params.to);
    // Use the connection
    // eslint-disable-next-line max-len
    connection.query(
      `SELECT Title, Body, CreationDate, Prenom, Nom, PostID, PersonID FROM posts p INNER JOIN users u ON p.Author=u.PersonID ORDER BY p.PostID DESC LIMIT ${req.params.from}, ${req.params.to};`,
      (error, results) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        res.locals.SQLResponse = results;
        next();
      },
    );
  });
};

// Fonction qui ajoute un post à la base de données
exports.getPostFromDB = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    // Use the connection
    // eslint-disable-next-line max-len
    connection.query(
      `SELECT Title, Body, CreationDate, Prenom, Nom, PostID, PersonID FROM posts p INNER JOIN users u ON p.Author=u.PersonID ORDER BY p.PostID DESC;`,
      (error, results) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        res.locals.SQLResponse = results;
        next();
      },
    );
  });
};


// Fonction qui ajoute un post à la base de données
exports.addCommentToDB = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    // Use the connection
    connection.query(
      `INSERT INTO comments VALUES (NULL, ${res.locals.PersonID}, ${pool.escape(req.body.CommentBody)}, ${req.body.PostID}, NULL)`,
      (error, results) => {
        if (error) {
          console.error(error);
          res.statusCode = 500;
          next();
        } else {
          if (results.insertId) {
            let commentID = results.insertId;
            connection.query(
                `SELECT CommentBody, CreationDate, Prenom, Nom, CommentID, PersonID
           FROM comments c
                    INNER JOIN users u ON c.Author = u.PersonID
           WHERE c.CommentID = ${commentID}
           LIMIT 1;`,
                (error, results) => {
                  if (error) {
                    res.statusCode = 500;
                  } else {
                    res.statusCode = 200;
                    res.locals.SQLResponse = results;
                  }
                  connection.release();

                  next();
                },
            );

          } else {
            res.statusCode = 500;
          }
        }
      },
    );
  });
};

// Middleware to get all comments for a post from database
exports.getCommentFromDB = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    // Use the connection
    // eslint-disable-next-line max-len
    connection.query(
      `SELECT CommentBody, CreationDate, Prenom, Nom, CommentID, PersonID FROM comments c INNER JOIN users u ON c.Author=u.PersonID  WHERE c.PostID = ${req.params.PostID};`,
      (error, results) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        res.locals.SQLResponse = results;
        next();
      },
    );
  });
};


exports.getCommentsFromTo = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!

    // Use the connection
    // eslint-disable-next-line max-len
    connection.query(
      `SELECT CommentBody, CreationDate, Prenom, Nom, CommentID, PersonID FROM comments c INNER JOIN users u ON c.Author=u.PersonID  WHERE c.PostID = ${req.params.PostID} ORDER BY c.CommentID DESC LIMIT ${req.params.from}, ${req.params.to};`,
      (error, results) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        res.locals.SQLResponse = results;
        next();
      },
    );
  });
};

// Fonction de suppression d'un post
exports.deleteCommentFromDB = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    // Use the connection
    // eslint-disable-next-line max-len
    connection.query(
      `SELECT Author FROM comments WHERE CommentID = ${req.params.CommentID};`,
      (error, results) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        if (results[0].Author === res.locals.PersonID || (res.locals.IsAdmin === 1)) {
          pool.getConnection((err, connection) => {
            if (err) throw err; // not connected!
            // Use the connection
            // eslint-disable-next-line max-len
            connection.query(
              `DELETE FROM comments WHERE CommentID = ${req.params.CommentID};`,
              (error, results) => {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                res.locals.SQLResponse = results;
                next();
              },
            );
          });
        } else {
          // eslint-disable-next-line max-len
          res.locals.SQLResponse = 'You are not the author of this comment ! You can\'t delete it.';
          next();
        }
      },
    );
  });
};

// Fonction de suppression d'un post
exports.deletePostFromDB = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    // Use the connection
    // eslint-disable-next-line max-len
    connection.query(
      `SELECT Author FROM posts WHERE PostID = ${req.params.PostID};`,
      (error, results) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        console.log(req.params.PostID);
        if ((results[0].Author === res.locals.PersonID) || (res.locals.IsAdmin === 1)) {
          pool.getConnection((err, connection) => {
            if (err) throw err; // not connected!
            // Use the connection
            connection.query(
              `DELETE FROM posts WHERE PostID = ${req.params.PostID} LIMIT 1 ;`,
              (error, results) => {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                res.locals.SQLResponse = results;
                next();
              },
            );
          });
        } else {
          res.locals.SQLResponse = 'You are not the author of this Post! You can\'t delete it.';
          next();
        }
      },
    );
  });
};

// Fonction qui recupère les informations d'un utilisateur
exports.getUserInfo = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    // Use the connection
    connection.query(
      `SELECT Prenom, Nom, Mail, PersonID FROM users WHERE PersonID = ${res.locals.PersonID};`,
      (error, results) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        res.locals.user = results;
        next();
      },
    );
  });
};

// Fonction de suppression de compte utilisateur
exports.deleteUser = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    // Use the connection
    connection.query(
      `DELETE FROM users WHERE PersonID = ${res.locals.PersonID};`,
      (error, results) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.g
        if (error) throw error;
        res.locals.SQLResponse = results;
        next();
      },
    );
  });
};

// Fonction qui récupère le hash du mot de passe
exports.getPasswordHash = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    // Use the connection
    connection.query(
      `SELECT Pass FROM users WHERE PersonID = ${res.locals.PersonID};`,
      (error, results) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        res.locals.PasswordHash = results[0].Pass;
        next();
      },
    );
  });
};

// Fonction qui change le mot de passe
exports.updatePasswordHashInDB = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("ici")
    console.log(res.locals);
    // Use the connection
    connection.query(
      `UPDATE users SET Pass = '${res.locals.newPasswordHash}' WHERE PersonID = ${res.locals.PersonID};`,
      (error, results) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        res.locals.SQLResponse = results;
        next();
      },
    );
  });
};

exports.deleteAccountInDB = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    // Use the connection
    connection.query(
      `DELETE FROM users WHERE PersonID = ${res.locals.PersonID} LIMIT 1;`,
      (error, results) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        res.locals.SQLResponse = results;
        next();
      },
    );
  });
}
