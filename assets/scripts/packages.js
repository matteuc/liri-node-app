var inquirer = require("inquirer");
var axios = require("axios");
var spotify = require("node-spotify-api");
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