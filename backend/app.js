
const express = require("express"); //ExpressJS module
const path = require("path");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json()); // To parse the incoming requests with JSON payloads


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});


module.exports = app;
