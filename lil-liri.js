require("dotenv").config();

var colors = require('colors');
var packages = require("./assets/scripts/packages.js");

var usage = "node liri.js [optional: path to command file]";
var database, query;

// Choices to be prompted to user (databases in promptUser & queryDatabase)
var databaseChoices = ["Search up music!", "Search up movies!", "Search up concerts!", "Search up TV shows!"];

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
            case "tv":
                database = "tvMaze";
                break;
            default:
                console.log("Command type not recognized.".red);
                return console.log("Type must be: movie, music, concert, tv.".yellow);

        }

        query = commandArgs[1];
        queryDatabase();
    })
}
// ----- If no command file passed in -----//
else {
    promptUser();
}

// Ask user what they would like to do?
function promptUser() {
    function printDatabaseArt() {
        var artText = "";
        var omdbText = "~ OMDB ~";
        var spotifyText = "~ Spotify ~";
        var bandsText = "~ Bands In Town ~";
        var tvText = "~ TVmaze ~"

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
            case "tvMaze":
                artText = tvText;
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
            case "Search up TV shows!":
                database = "tvMaze";
                break;

        }

        console.log("\n");
        printDatabaseArt();
        promptQuery();
    })

}

// Ask user what they would like to search for
function promptQuery() {
    var moviePrompt = "What film would you like to know more about?";
    var musicPrompt = "What do you want to jam out to today?";
    var concertPrompt = "What concert do you want to go to?";
    var tvPrompt = "What TV show do you want to watch?";
    var queryPrompt = "";

    // set the appropriate prompt
    (database == "omdb") ? queryPrompt = moviePrompt: (database == "spotify") ? queryPrompt = musicPrompt : (database == "bandsInTown") ? queryPrompt = concertPrompt : (database == "tvMaze") ? queryPrompt = tvPrompt : '';

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

// Ask user what they would like to do for their next action (after a database query)
function promptRestart() {
    var term = "";
    switch (database) {
        case "omdb":
            term = "movie";
            break;
        case "spotify":
            term = "song, artist, or album";
            break;
        case "bandsInTown":
            term = "concert";
            break;
        case "tvMaze":
            term = "TV show";
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

// Query the desired database
function queryDatabase() {
    query = formatQuery(query);

    switch (database) {
        case "omdb":
            queryMovie();
            break;
        case "spotify":
            queryMusic();
            break;
        case "bandsInTown":
            queryConcert();
            break;
        case "tvMaze":
            queryTVshow();
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
                        console.log("\nMovie was not found! Please try again.\n".red);
                        return promptQuery();
                    } else {
                        // Log out information here
                        console.log(`\nThe best movie match for ${query.split("+").join(" ")} is:\n`.magenta);

                        // Print Movie Title
                        printTextArt(response.data.Title, "ANSI Shadow");
                        // Print Release Date
                        printTextArt("Release Date", "Stick Letters")
                        console.log(response.data.Released.underline);
                        // Print IMDB Rating of the movie
                        printTextArt("IMDB", "Stick Letters");
                        console.log(response.data.imdbRating.yellow);

                        // Print Rotten Tomatoes Rating
                        printTextArt("Rotten Tomatoes", "Stick Letters");
                        console.log(response.data.Ratings[1].Value.red);

                        // Print Production Country
                        printTextArt("Country", "Stick Letters");
                        console.log(response.data.Country.blue);

                        // Print Language
                        printTextArt("Language", "Stick Letters");
                        console.log(response.data.Language.cyan);

                        // Print Plot
                        printTextArt("Plot", "Stick Letters");
                        console.log(response.data.Plot.bold)

                        // Print Actors
                        printTextArt("Cast", "Stick Letters");
                        console.log(response.data.Actors.green)

                        console.log("\n");
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

    function formatQuery(unformattedQuery) {
        var formattedQuery =
            unformattedQuery.split(' ').join('+');
        return formattedQuery;
    }

    function queryMusic() {
        var optionPrompts = {
            trackPrompt: "... a song?",
            artistPrompt: "... an artist?",
            albumPrompt: "... an album?"
        }
        packages.inquirer.prompt({
            name: "apiOption",
            type: "list",
            message: `Would you like to search ${query.split("+").join(" ")} as...`,
            choices: [optionPrompts.trackPrompt, optionPrompts.artistPrompt, optionPrompts.albumPrompt]

        }).then(function (answers) {
            console.log("Loading...".yellow);
            switch (answers.apiOption) {
                case optionPrompts.trackPrompt:
                    queryTrack();
                    break;
                case optionPrompts.artistPrompt:
                    queryArtist();
                    break;
                case optionPrompts.albumPrompt:
                    queryAlbum();
                    break;
            }

        })



        function queryTrack() {
            packages.spotify.search({
                    type: 'track',
                    query: query,
                    limit: 1
                })
                .then(function (response) {

                    if (response.tracks.items.length === 0) {
                        console.log(`\nNo tracks named ${query.split("+").join(" ")} were found!\n`.red);
                        return promptQuery();
                    } else { // Inform user a result has been found
                        console.log(`\nThe best song match for ${query.split("+").join(" ")} is:\n`.magenta);

                        // Show formatted result
                        var track = response.tracks.items[0];

                        // Print Track Title
                        printTextArt(track.name, "ANSI Shadow");

                        if (track.artists) {
                            // Print Artists header
                            printTextArt("Artist(s)", "Stick Letters")
                            // Print Artists
                            for (var artist of track.artists) {
                                console.log(`${artist.name.bold}: ${`https://open.spotify.com/artist/${artist.uri.split(":")[2]}`.cyan}`);
                            }
                        }

                        if (track.album) {
                            // Print Album header 
                            printTextArt("Album", "Stick Letters");
                            // Print Album
                            console.log(`${track.album.name.bold}: ${`https://open.spotify.com/album/${track.album.uri.split(":")[2]}`.cyan}`)
                        }

                        if (track.uri) {
                            // Print 'Play Now!' header
                            printTextArt("Play Now!", "Stick Letters");
                            // Print link to song
                            console.log(`${track.name.bold}: ${`https://open.spotify.com/track/${track.uri.split(":")[2]}`.green}`);
                        }

                    }

                    console.log("\n");
                    // Prompt user for another input
                    promptRestart();
                })
                .catch(function (err) {
                    console.log(err);
                });
        }

        function queryArtist() {
            packages.spotify.search({
                    type: 'artist',
                    query: query,
                    limit: 1
                })
                .then(function (response) {
                    if (response.artists.items.length === 0) {
                        console.log(`\nNo artists named ${query.split("+").join(" ")} were found!\n`.red);
                        return promptQuery();
                    } else { // Inform user a result has been found
                        console.log(`\nThe best artist match for ${query.split("+").join(" ")} is:\n`.magenta);

                        var artist = response.artists.items[0];
                        // Show formatted result

                        // Print Artist Title
                        printTextArt(artist.name, "ANSI Shadow");

                        if (artist.popularity) {
                            printTextArt(`Ranking: ${artist.popularity}`, "Small Slant");
                        }

                        if (artist.genres) {
                            if (artist.genres.length !== 0) {
                                printTextArt("Genres", "Stick Letters");
                                for (var genre of artist.genres) {
                                    console.log(genre.yellow);
                                }
                            }
                        }

                        if (artist.uri) {
                            printTextArt("Artist Profile", "Stick Letters");
                            console.log(`${"Link to Profile".bold}: ${`https://open.spotify.com/artist/${artist.uri.split(":")[2]}`.green}`);
                        }
                    }

                    console.log("\n");
                    // Prompt user for another input
                    promptRestart();
                })
                .catch(function (err) {
                    console.log(err);
                });
        }

        function queryAlbum() {
            packages.spotify.search({
                    type: 'album',
                    query: query,
                    limit: 1
                })
                .then(function (response) {
                    if (response.albums.items.length === 0) {
                        console.log(`\nNo albums named ${query.split("+").join(" ")} were found!\n`.red);

                        return promptQuery();
                    } else {
                        var album = response.albums.items[0];

                        packages.spotify.request(`https://api.spotify.com/v1/albums/${album.uri.split(":")[2]}/tracks?offset=0`)
                            .then(function (data) {
                                // Inform user a result has been found
                                console.log(`\nThe best album match for ${query.split("+").join(" ")} is:\n`.magenta);

                                // Show formatted result

                                // Print Album Title
                                printTextArt(album.name, "ANSI Shadow");

                                if (album.artists) {
                                    printTextArt(`Artists`, "Stick Letters");
                                    // Print Artists
                                    for (var artist of album.artists) {
                                        console.log(`${artist.name.bold}: ${`https://open.spotify.com/artist/${artist.uri.split(":")[2]}`.cyan}`)
                                    }

                                }

                                if (album.genres) {
                                    if (album.genres.length !== 0) {
                                        printTextArt("Genres", "Stick Letters");
                                        for (var genre of album.genres) {
                                            console.log(genre.yellow);
                                        }
                                    }
                                }

                                if (album.popularity) {
                                    printTextArt(`Ranking: ${album.popularity}`, "Small Slant");
                                }

                                var trackList = data.items;
                                if (trackList) {
                                    printTextArt(`Tracks`, "Stick Letters");
                                    // Print Tracks
                                    for (var track of trackList) {
                                        console.log(`${track.name.bold}: ${`https://open.spotify.com/track/${track.uri.split(":")[2]}`.cyan}`)
                                    }
                                }

                                if (album.uri) {
                                    printTextArt("Album Info", "Stick Letters");
                                    console.log(`${"Link to Album".bold}: ${`https://open.spotify.com/album/${album.uri.split(":")[2]}`.green}`);
                                }


                                console.log("\n");
                                // Prompt user for another input
                                promptRestart();
                            })
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });

        }

    }

    function queryConcert() {
        var queryURL = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp";

        packages.axios.get(queryURL)
            .then(
                function (response) {
                    // If no response was returned (ie. band was not found)
                    if (response.data == "\n{warn=Not found}\n") {
                        console.log("\nBand was not found! Please try again.\n".red);
                        return promptQuery();
                    } else {
                        console.log("\n");
                        // Print artist/band name
                        printTextArt(`${query.split('+').join(' ')}`, "ANSI Shadow");

                        // Log out information here

                        var events = response.data;

                        if (events.length !== 0) {
                            for (var event of events) {
                                // Log event information here!
                                console.log("≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈")
                                printTextArt("The Venue", "Stick Letters")
                                console.log(event.venue.name.magenta.bold);
                                printTextArt("The Location", "Stick Letters")
                                console.log(event.venue.latitude.bold, event.venue.longitude.bold);
                                console.log(`${event.venue.city.cyan}, ${event.venue.region.cyan} ${event.venue.country.cyan}`)
                                printTextArt("The Date", "Stick Letters")
                                var splitDate = event.datetime.split("T");
                                var date = splitDate[0];
                                var time = splitDate[1];
                                console.log(packages.moment(time, "HH:mm:ss").format("h:mm:ss a").yellow.bold);
                                console.log(packages.moment(date).format("MMMM D, YYYY").yellow);
                                if (event.offers[0]) {
                                    printTextArt("The Tickets", "Stick Letters");
                                    console.log(event.offers[0].url.green);
                                }

                            }
                        } else {
                            console.log(`No events were found for ${query.split('+').join(' ')}`);
                        }

                        console.log("\n");
                        // Prompt user for another input
                        promptRestart();

                    }
                })
    }

    function queryTVshow() {
        var optionPrompts = {
            showPrompt: "... a TV show?",
            personPrompt: "... an actor/actress?"
        }

        packages.inquirer.prompt([{
            name: "apiOption",
            type: "list",
            message: `Would you like to search ${query.split("+").join(" ")} as...`,
            choices: [optionPrompts.showPrompt, optionPrompts.personPrompt]
        }]).then(function (answers) {
            console.log("Loading...".yellow);
            switch (answers.apiOption) {
                case optionPrompts.showPrompt:
                    queryShow();
                    break;
                case optionPrompts.personPrompt:
                    queryPerson();
                    break;
            }

        });

        function queryShow() {
            packages.axios.get(`http://api.tvmaze.com/singlesearch/shows?q=${query}`).then(function (res) {
                var show = {
                    name: res.data.name,
                    genres: res.data.genres.join(", "),
                    rating: res.data.rating[Object.keys(res.data.rating)[0]],
                    network: res.data.network,
                    summary: res.data.summary
                }

                console.log(`\nThe best show match for ${query.split("+").join(" ")} is:\n`.magenta);

                // Print show title
                printTextArt(show.name, "ANSI Shadow");
                // Print Show information
                if (show.genres) {
                    printTextArt("Genres", "Stick Letters");
                    console.log(show.genres.yellow);
                }
                if (show.rating) {
                    printTextArt("Rating", "Stick Letters");
                    console.log(show.rating.green);
                }
                if (show.network) {
                    printTextArt("Network", "Stick Letters");
                    console.log(show.network.blue);
                }
                if (show.summary) {
                    printTextArt("Summary", "Stick Letters");
                    console.log(show.summary.bold);
                }

                console.log("\n");
                promptRestart();
            }).catch(function (err) {
                if (err) {
                    console.log(`No shows named ${query.bold} were found.\n`.red);
                    return promptQuery();
                }
            });
        }

        function queryPerson() {
            packages.axios.get(`http://api.tvmaze.com/search/people?q=${query}`).then(function (res) {

                var actorData = res.data[0].person;
                var actor = {
                    name: actorData.name,
                    gender: actorData.gender,
                    birthday: actorData.birthday,
                    country: actorData.country.name,
                    url: actorData.url
                }

                console.log(`\nThe best person match for ${query.split("+").join(" ")} is:\n`.magenta);

                // Print show title
                printTextArt(actor.name, "ANSI Shadow");
                // Print Show information
                if (actor.gender) {
                    printTextArt("Gender", "Stick Letters");
                    console.log(actor.gender.blue);
                }
                if (actor.birthday) {
                    printTextArt("Birthday", "Stick Letters");
                    console.log(actor.birthday.yellow);
                }
                if (actor.country) {
                    printTextArt("Country", "Stick Letters");
                    console.log(actor.country.bold);
                }
                if (actor.url) {
                    printTextArt("Full Profile", "Stick Letters");
                    console.log(actor.url.green);
                }

                console.log("\n");
                promptRestart();


            }).catch(function (err) {
                if (err) {
                    console.log(`No people named ${query.bold} were found.\n`);
                    return promptQuery();
                }
            });
        }

    }

}

// Print the properties of the specified object
function printProps(obj) {
    for (var prop in obj) {
        console.log(prop);
    }
}

// Print the items of the specified array
function printItems(arr) {
    for (var item of arr) {
        console.log(item);
    }
}

// Print the specified text in the specified font family using 'figlet'
function printTextArt(text, font) {
    console.log(packages.figlet.textSync(text, {
        font: font,
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }));

}