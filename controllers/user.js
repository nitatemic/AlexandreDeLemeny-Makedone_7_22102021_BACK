const argon2 = require('argon2'); // Argon2 module (For password hashing)
const jwt = require('jsonwebtoken'); // JWT module (For token generation)
const dbConnectMiddleware = require('../middlewares/dbConnect');
require('dotenv').config();

/* ---------- Creation d'user ---------- */
exports.createUser = (req, res) => {
  argon2.hash(req.body.password).then((hashedPass) => {
    dbConnectMiddleware.addUser(req, hashedPass);
  }).then(() => res.status(201).json({
      message: 'User created!',
    }));
};
/* ---------- Fin creation d'user ---------- */

/* ---------- Login ----------*/
exports.login = async (req, res) => {
  //Vérifier si les champs sont remplis
  if (!req.body.mail || !req.body.password) {
    return res.status(400).json({
      message: 'All fields are required!',
    });
  }

  dbConnectMiddleware.getCredentials(req, res, async () => {
    if (res.locals.SQLResponse[0] === undefined) {
      return res.status(401).json({
        message : 'Wrong credentials'
      })
    }
    //Vérifier si le mot de passe est correct

    try {
      if (!await argon2.verify(res.locals.SQLResponse[0].Pass,
          req.body.password)) {
        return res.status(401).json({
          message: 'Wrong credentials!',
        });
      }
    }
    catch (err) {
      return res.status(500).json({
        message: 'Oops! Something went wrong!',
      });
    }

    res.status(200).json({
      PersonID: res.locals.SQLResponse[0].PersonID,
      IsAdmin: res.locals.SQLResponse[0].IsAdmin,
      token: jwt.sign(
          {
            PersonID: res.locals.SQLResponse[0].PersonID,
            IsAdmin: res.locals.SQLResponse[0].IsAdmin
          },
          process.env.SECRET,
          {
            expiresIn: '12h',
          },
      )
    })
  })
};

/* ---------- Fin login ----------*/
// Renvoie un nouveau token si le token est valide

exports.refreshToken = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({
        error: 'Invalid token',
      });
      return;
    }
    res.status(200).json({
      PersonID: decoded.PersonID,
      IsAdmin : decoded.IsAdmin,
      token: jwt.sign(
        {
          PersonID: decoded.PersonID,
          IsAdmin : decoded.IsAdmin
        },
        process.env.SECRET,
        {
          expiresIn: '12h',
        },
      ),
      message: 'Posts fetched!',
      posts: res.locals.SQLResponse,    // Why ?
    });
  });
};

