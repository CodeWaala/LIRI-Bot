require("dotenv").config();

const keys = require('./keys.js');
const request = require('request');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const fs = require('fs');

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);
var omdbkey = keys.omdb.api_key;

//console.log(omdb);

// command and request 
var liricommand = process.argv[2];
var lirirequest = process.argv[3];

switch (liricommand) {
    case 'my-tweets':
        getTweets();
        break;
    case 'spotify-this-song':
       if(lirirequest){
        getSong(lirirequest);
        } else{
         getSong("I Want it That Way")
       }
        break;
    case 'movie-this':
        if(lirirequest)
        {
          getMovie(lirirequest);
        } else{
           getMovie("Titanic")
        }
        break;
    case 'do-what-it-says':
        doWhatItSays();
        break;
    default:
       console.log("Invalid Command!!")
       break;
}

function getTweets() {
    twitter.get('statuses/home_timeline', function(error, tweet, response) {

        if(error) throw error;

       console.log("______My Tweets______________");
       tweet.forEach(function(item,index){
           console.log("___________________________________");
           console.log(item.text)
       })
    });
}

function getSong(songrequest) {
    
spotify
  .search({ type: 'track', query: songrequest, limit:1 })
  .then(function(response) {
    var items = response.tracks.items;
     items.forEach(function(item,index){
         console.log("___Song Details_____");
         console.log("*********************")
         console.log("Song: " + item.name + "\n Artist: " + item.artists[0].name + "\n Album: " + item.album.name + "\n Preview Url: " + item.preview_url )
     })
  })
  .catch(function(err) {
    console.log(err);
  });
}

function getMovie(movierequest) {
    var queryURL = "https://www.omdbapi.com/?t=" + movierequest + "&y=&plot=short&apikey="+omdbkey;

    request(queryURL, function(error, response, body) {
  // If the request is successful (i.e. if the response status code is 200)
  if (!error && response.statusCode === 200) {
    var moviebody = JSON.parse(body);
    //console.log(moviebody);
    console.log("Title: " + moviebody.Title + "\n Year: " + moviebody.Year + "\n Rated: " + moviebody.Title + "\n Released: " + moviebody.Year + "\n Country: " + moviebody.Country + "\n Plot: " + moviebody.Country +
    moviebody.Released + "\n Runtime: " + moviebody.Runtime + "\n Genre: " + moviebody.Genre + "\n Director: " + moviebody.Director + "\n IMDB Rating: " + moviebody.imdbRating + "\n Rotten Tomatoes: " + moviebody.Ratings[1].Value);
    }
  });
}


function doWhatItSays() {
    fs.readFile('random.txt', "utf8", function(error, data){
          var txtfile = data.split(',');
          getSong(txtfile[1]);
    });
}