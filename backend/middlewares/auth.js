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
