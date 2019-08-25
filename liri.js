require("dotenv").config();


var keys = require("./assets/scripts/keys.js")
var packages = require("./assets/scripts/packages.js");

var usage = "node liri.js [optional: path to command file]";
var database, query;

// Choices to be prompted to user (databases in promptUser & queryDatabase)
var databaseChoices = ["Search up music!", "Search up movies!", "Search up concerts!"];

// Allow for file to be passed in as the command (process.argv[2])
if (process.argv[2]) {
    // Read file using "fs" and invoke queryDatabase()
    packages.fs.readFile(process.argv[2], "utf8", function (error, data) {
        if (error) {
            return console.log(`An error has occurred: ${error}\n${usage}`);
        }

        var commandArgs = data.split(",");
        switch (commandArgs[0]) {
            case "movie":
                database = "omdb";
                break;
            case "music":
                database = "spotify";
                break;
            case "concert":
                database = "bandsInTown";
                break;
        }

        query = commandArgs[1];
        queryDatabase();
    })
}
// ----- If no command file passed in -----//
else {
    promptUser();
}

function promptUser() {
    function printArt() {
        var artText = "";
        var omdbText = "~ OMDB ~";
        var spotifyText = "~ Spotify ~";
        var bandsText = "~ Bands In Town ~";

        switch (database) {
            case "omdb":
                artText = omdbText;
                break;
            case "spotify":
                artText = spotifyText;
                break;
            case "bandsInTown":
                artText = bandsText;
                break;
        }

        console.log(packages.figlet.textSync(artText, {
            font: 'ANSI Shadow',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }));
    }

    // Prompt user for database (list) and the desired action (input)
    packages.inquirer.prompt([{
        name: "database",
        type: "list",
        message: "What would you like to do?",
        choices: databaseChoices
    }]).then(function (answers) {
        switch (answers.database) {
            case "Search up movies!":
                database = "omdb";
                break;
            case "Search up music!":
                database = "spotify";
                break;
            case "Search up concerts!":
                database = "bandsInTown";
                break;
        }

        console.log("\n");
        printArt();
        promptQuery();
    })

}

function promptQuery() {
    var moviePrompt = "What film would you like to know more about?";
    var musicPrompt = "What song do you want to jam out today?";
    var concertPrompt = "What concert do you want to go to?";
    var queryPrompt = "";

    // set the appropriate prompt
    (database == "omdb") ? queryPrompt = moviePrompt: (database == "spotify") ? queryPrompt = musicPrompt : (database == "bandsInTown") ? queryPrompt = concertPrompt : '';

    // Prompt user with customized message
    packages.inquirer.prompt([{
        name: "query",
        message: queryPrompt,
        validate: function (val) {
            if (val) {
                return true;
            } else {
                return 'Please enter a query!';
            }
        }
    }]).then(function (answers) {
        // Invoke queryDatabase(database, query);
        query = answers.query;
        queryDatabase();
    })

}

function promptRestart() {
    var term = "";
    switch (database) {
        case "omdb":
            term = "movie";
            break;
        case "spotify":
            term = "song";
            break;
        case "bandsInTown":
            term = "concert";
            break;
    }

    var restartChoices = [`Search up another ${term}!`, "Search within another database!"];

    packages.inquirer.prompt([{
        message: "What would you like to do next?",
        name: "choice",
        type: "list",
        choices: restartChoices

    }]).then(function (answers) {
        switch (answers.choice) {
            case `Search up another ${term}!`:
                promptQuery();
                break;
            case "Search within another database!":
                promptUser();
                break;
        }
    })
}

function queryDatabase() {

    switch (database) {
        case "omdb":
            query = formatMovieQuery(query);
            queryMovie();
            break;
        case "spotify":
            queryMusic();
            break;
        case "bandsInTown":
            queryConcert();
            break;
    }

    function queryMovie() {
        // Run a request with axios to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy";

        packages.axios.get(queryUrl)
            .then(
                function (response) {
                    // If no response was returned (ie. movie was not found)
                    if (response.data.Response == "False") {
                        console.log("Movie was not found! Please try again.");
                        return queryPrompt();
                    } else {
                        // Log out information here
                        console.log(`${response.data.Title} data has been retrieved!`);

                        // Prompt user for another input
                        promptRestart();

                    }
                })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("---------------Data---------------");
                    console.log(error.response.data);
                    console.log("---------------Status---------------");
                    console.log(error.response.status);
                    console.log("---------------Status---------------");
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an object that comes back with details pertaining to the error that occurred.
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
                console.log(error.config);
            });
    }

    function formatMovieQuery(unformattedQuery) {
        var formattedQuery = unformattedQuery.split(' ').join('+');
        return formattedQuery;
    }

    function queryMusic() {}

    function queryConcert() {}

}