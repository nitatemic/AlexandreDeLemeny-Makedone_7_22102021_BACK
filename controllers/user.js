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
exports.login = (req, res) => {
  const {SQLResponse} = res.locals;

  // Vérifier que le mot de passe est correct
  argon2.verify(SQLResponse[0].Pass, req.body.password).then((match) => {
    if (!match) {
      res.status(400).json({
        error: 'Wrong password',
      });
      return;
    }

    res.status(200).json({
      PersonID: SQLResponse[0].PersonID,
      IsAdmin : SQLResponse[0].IsAdmin,
      token: jwt.sign(
        {
          PersonID: SQLResponse[0].PersonID,
          IsAdmin : SQLResponse[0].IsAdmin
        },
        process.env.SECRET,
        {
          expiresIn: '12h',
        },
      ),
    });
  });
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
      posts: res.locals.SQLResponse,
    });
  });
};
