const argon2 = require("argon2"); //Argon2 module (For password hashing)
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ---------- Creation d'user ---------- */

exports.createUser = (req, res) => {
  let mail = req.body.email;
  let password = req.body.password;
  let firstName = req.body.firstName;
  let lastName = req.body.lastname;


  //Vérifier que les champs sont remplis
  if (!mail || !password || !firstName || !lastName) {
    res.status(400).json({
      error: "Please fill in all fields",
    });
    return;
  }

  argon2.hash(password).then((hashedPass) => {

  });
};

/* ---------- Fin creation d'user ---------- */

/* ---------- Login ----------*/

exports.login = (req, res) => {
  //Vérifier que les champs sont remplis
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      error: "Missing mail or password",
    });
    return;
  }

  //Vérifier que le mail existe
  User.findOne(
    {
      mail: req.body.email,
    },
    function (err, user) {
      if (err) {
        res.status(500).json({ err });
        return;
      }
      if (!user) {
        res.status(400).json({
          error: "Mail doesn't exist",
        });
        return;
      }

      //Vérifier que le mot de passe est correct
      argon2.verify(user.passwordHash, req.body.password).then((match) => {
        if (!match) {
          res.status(400).json({
            error: "Wrong password",
          });
          return;
        }

        res.status(200).json({
          userId: user._id,
          token: jwt.sign(
            {
              userId: user._id,
            },
            secret,
            {
              expiresIn: "12h",
            }
          ),
        });
      });
    }
  );
};
