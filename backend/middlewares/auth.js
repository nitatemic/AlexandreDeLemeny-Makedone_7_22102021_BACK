const express = require("express"); //ExpressJS module
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
require("dotenv").config();
const SECRET = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

exports.checkMail = (req, res, next) => {
  if (
    !req.body.email.match(
      /^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/i
    )
  ) {
    return res.status(400).json({
      error: "Invalid mail",
    });
  }
  next();
};

exports.AllFieldsCompleted  = (req, res, next) => {
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
  next();
}


//Vérifier que le token est valide
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: "You must be logged in to access this resource",
    });
  }
  if (jwt.verify(token, SECRET)) {
    next();
  } else {
    res.status(400);
  }
};

