# Lil' LIRI

Lil' LIRI is a Language Interpretation and Recognition Interface. Powered by Node.js and multiple APIs, Lil' LIRI helps you learn about the latest hits, upcoming movies, the hottest concerts, and the most popular TV shows. 

## Table of Contents
- [Usage](#usage) 
- [Packages](#packages)
- [APIs](#apis)
- [Music](#music)
- [Movies](#movies)
- [Concerts](#concerts)
- [TV](#tv)


### Usage 
Lil' LIRI can be run from the command like this: 

First install the dependencies...
```sh
$ npm install 
```

Then you are good to go!
```sh
$ node lil-liri
```

***Alternative Usage***

Lil' LIRI can also be run by providing a text file with the desired commands.

__Command Format__

*queryType*,*query*

__Available Types__

The query type entered must match exactly with those below or else Lil' LIRI will not work.

| Query Type | Description |
| ------ | ------ |
| music | Search songs, artists, or albums through the Spotify API |
| movie | Search movies through the OMDB API |
| concert | Search concerts through the Bands in Town API |
| tv | Search TV shows through the TVmaze API |

### Packages
Lil' LIRI uses multiple node packages. Their names and usage are listed below.

| API | DOCUMENTATION | FUNCTION |
| ------ | ------ | ------ |
| *axios* | https://www.npmjs.com/package/axios | Make API requests | 
| *colors* | https://www.npmjs.com/package/colors | Log out colored text |
| *dotenv* | https://www.npmjs.com/package/dotenv | Loading environment variables |
| *figlet* | https://www.npmjs.com/package/figlet | Log out ASCII art |
| *fs* | https://nodejs.org/api/fs.html | Read/write files |
| *inquirer* | https://www.npmjs.com/package/inquirer | Pretty prompting |
| *moment* | https://www.npmjs.com/package/moment | Time formatting|
| *node-spotify-api* | https://www.npmjs.com/package/node-spotify-api | Accessing the Spotify API |



### APIs
Lil' LIRI currently uses four different APIs. Their names and usage are listed below.

| API | README | 
| ------ | ------ |
| Spotify | https://developer.spotify.com/documentation/web-api/ | 
| OMDB | http://www.omdbapi.com/ |
| Bands in Town | https://app.swaggerhub.com/apis-docs/Bandsintown/PublicAPI/3.0.0 |
| TVmaze | https://www.tvmaze.com/api |

All the above APIs were accessed via **axios**, with the exception of the Spotify API (accessed via the package **node-spotify-api**).

### Music
To find your favorite song, artist or album, select the 'Search up music!' option. 

 ![Choosing the Spotify API.](/assets/media/databaseChoice-music.png "Choosing the Spotify API")

 After entering your query, you will be prompted on what type of result you would like to see (i.e song, artist, album).

 ![Choosing the Spotify API option.](/assets/media/apiChoice-music.png "Choosing the Spotify API option")

 After selecting your choice, the result will print out (assuming that the query is valid).

 ![Spotify result.](/assets/media/result-music.png "Spotify result")

If the query is not valid, an error will display and you will be reprompted.

![Spotify error.](/assets/media/error-music.png "Spotify error")

### Movies
To find your favorite movie, select the 'Search up movies!' option. 

 ![Choosing the OMDB API.](/assets/media/databaseChoice-movie.png "Choosing the OMDB API")

 After entering your query, the result will print out (assuming that the query is valid).

 ![OMDB result.](/assets/media/result-movie.png "OMDB result")

If the query is not valid, an error will display and you will be reprompted.

![OMDB error.](/assets/media/error-movie.png "OMDB error")

### Concerts
To find concerts for your favorite artist, select the 'Search up concerts!' option. 

 ![Choosing the Bands in Town API.](/assets/media/databaseChoice-concert.png "Choosing the Bands in Town API")

 After entering your query, the result will print out (assuming that the query is valid).

 ![Bands in Town result.](/assets/media/result-concert.png "Bands in Town result")

If the query is not valid, an error will display and you will be reprompted.

![Bands in Town error.](/assets/media/error-concert.png "Bands in Town error")

### TV
To find your favorite TV show or actor/actress, select the 'Search up TV shows!' option. 

 ![Choosing the TVmaze API.](/assets/media/databaseChoice-tv.png "Choosing the TVmaze API")

 After entering your query, you will be prompted on what type of result you would like to see (i.e TV show or actor/actress).

 ![Choosing the TVmaze API option.](/assets/media/apiChoice-tv.png "Choosing the TVmaze API option")

 After selecting your choice, the result will print out (assuming that the query is valid).

 ![TVmaze result.](/assets/media/result-tv.png "TVmaze result")

If the query is not valid, an error will display and you will be reprompted.

![TVmaze error.](/assets/media/error-tv.png "TVmaze error")




