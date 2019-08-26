var keys = require("./keys.js");
var inquirer = require("inquirer");
var axios = require("axios");
var SpotifyPackage = require("node-spotify-api");
var spotify = new SpotifyPackage(keys.spotifyConfig);
var moment = require("moment");
var figlet = require("figlet");
var fs = require("fs");

module.exports = {
    inquirer: inquirer,
    axios: axios, 
    spotify: spotify,
    moment: moment,
    figlet: figlet,
    fs: fs
}