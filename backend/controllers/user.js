const argon2 = require("argon2"); //Argon2 module (For password hashing)
const dbConnectMiddleware = require("../middlewares/dbConnect.js");
const jwt = require("jsonwebtoken"); //JWT module (For token generation)
require("dotenv").config();

/* ---------- Creation d'user ---------- */
exports.createUser = (req, res) => {
  argon2.hash(req.body.password).then((hashedPass) => {
    dbConnectMiddleware.addUser(req, hashedPass);
  }).then(() =>
      res.status(201).json({
        message: "User created!"
      }));
};
/* ---------- Fin creation d'user ---------- */

/* ---------- Login ----------*/
exports.login =  (req, res) => {
    const SQLResponse =  res.locals.SQLResponse;
    //Vérifier que le mot de passe est correct
    argon2.verify(SQLResponse[0].Pass, req.body.password).then((match) => {
      if (!match) {
        res.status(400).json({
          error: "Wrong password",
        });
        return;
      }

      res.status(200).json({
        PersonID: SQLResponse[0].PersonID,
        token: jwt.sign(
            {
              PersonID: SQLResponse[0].PersonID,
            },
            process.env.SECRET,
            {
              expiresIn: "12h",
            }
        ),
      });
    });
};
/* ---------- Fin login ----------*/
