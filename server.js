'use strict';

var http = require("http");
var express = require("express");

var DEFAULT_PORT = 2222;

var app = express();

// Serve static content
app.use(express.static("./dist"));

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
