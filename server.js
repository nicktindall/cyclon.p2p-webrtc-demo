'use strict';

var http = require("http");
var express = require("express");
var appMetadata = require("./AppMetadata");

var DEFAULT_PORT = 2222;

var app = express();

// Serve static content
app.use(express.static("./dist"));

// Serve the deployed version number
app.get("/version", function(req, res) {
    res.status(200).send(appMetadata);
});

//
// Allow CORS for all resources
//
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Create & start the server
http.createServer(app).listen(process.env.PORT || DEFAULT_PORT);
