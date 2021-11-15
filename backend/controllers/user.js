const argon2 = require("argon2"); //Argon2 module (For password hashing)
const dbConnectMiddleware = require("../middlewares/dbConnect.js");
const jwt = require("jsonwebtoken");

require("dotenv").config();

/* ---------- Creation d'user ---------- */

exports.createUser = (req, res) => {

  argon2.hash(req.body.password).then((hashedPass) => {
    dbConnectMiddleware.addUser(req.body.firstName, req.body.lastName, req.body.mail, hashedPass)
  }).then(() =>
      res.status(201).json({
        message: "User created!"
      }));


};

/* ---------- Fin creation d'user ---------- */

/* ---------- Login ----------*/

exports.login = async (req, res) => {

  let hashedPass = await dbConnectMiddleware.getCredentials(req.body.mail);
  console.log(hashedPass);
    //Vérifier que le mot de passe est correct
    argon2.verify(hashedPass, req.body.password).then((match) => {
      if (!match) {
        res.status(400).json({
          error: "Wrong password",
        });
        return;
      }

      res.status(200).json({
        userId: req.body.mail,
        token: jwt.sign(
            {
              userId: req.body.mail,
            },
            process.env.SECRET,
            {
              expiresIn: "12h",
            }
        ),
      });
    })
};
