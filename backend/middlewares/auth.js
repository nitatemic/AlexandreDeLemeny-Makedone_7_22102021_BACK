const express = require("express"); //ExpressJS module
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
require("dotenv").config();
const SECRET = process.env.SECRET;
const jwt = require("jsonwebtoken");

exports.checkMail = (req, res, next) => {
  if (
    !req.body.mail.match(
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

//Vérifier que les champs sont remplis
  if (!req.body.mail || !req.body.password || !req.body.firstName || !req.body.lastName) {
    res.status(400).json({
      error: "Please fill in all fields",
    });
    return;
  }
  next();
}

exports.AllFieldsCompletedForLogin  = (req, res, next) => {

//Vérifier que les champs sont remplis
  if (!req.body.mail || !req.body.password) {
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
  const decoded = jwt.verify(token, SECRET);
  if (decoded) {
    res.locals.userId = decoded.userId;
    next();
  } else {
    res.status(400);
  }
};

