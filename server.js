'use strict'

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3002;
const superagent = require('superagent');

// weather data is an object
const weather = require('./data/weather.json')


app.use(cors());


app.get('/', (request, response) => {
  //response object calls its send method
  response.send('hello!');
});


// Commented out from Lab07 below:
// // weather placeholder
// app.get('/weather', (request, response) => {
//   console.log(request.query);

//   try {
//     const weatherArray = weather.data.map(day => new Forecast(day));
//     response.status(200).send(weatherArray);
//   }
//   catch (err) {
//     response.send(errorHandler(err));
//   }
// });


// function Forecast(day) {
//   this.date = this.date = day.valid_date;
//   this.description = day.weather.description;
// }


// function errorHandler(err) {
//   console.log(err, 'error: something went wrong');
// }


// real-time weather, learned during lecture
app.get('/weather', getWeatherHandler);


async function getWeatherHandler(request, response) {
  try {

    const lat = request.query.lat;
    const lon = request.query.lon;
    const key = process.env.WEATHER_API_KEY;

    const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;


    // console.log('url', url);

    const weatherResponse = await superagent.get(url);
    const weatherObject = JSON.parse(weatherResponse.text);
    const weatherArray = weatherObject.data;
    const forecasts = weatherArray.map(day => new Forecast(day))

    response.send(forecasts);
  } catch(error) {
    console.log(error);
    response.send('oops!')
  }
}

class Forecast {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
  }
}


// movie database
app.get('/movies', getMovieHandler);


async function getMovieHandler(request, response) {
  console.log('made it to movies');

  const cityName = request.query.cityName;

  const movieKey = process.env.MOVIE_API_KEY;

  const url = `https://api.themoviedb.org/3/search/movie?query=${cityName}&api_key=${movieKey}`;

  const movieResponse = await superagent.get(url);
  const movieObject = JSON.parse(movieResponse.text);
  const movieArray = movieObject.results;
  const topMovies = movieArray.map(movie => new Movies(movie))

  response.send(topMovies);
}

class Movies {
  constructor(movie) {
    this.title = movie.title;
    this.popularity = movie.popularity;
    this.overview = movie.overview;
    // poster_path is what TMBD decided to name the property
    this.image = movie.poster_path;

    console.log(movie);
  }
}



// // every other GET request will result in a 404
app.get('*', (request, response) => {
  response.status(400, 404, 500).send('error: something went wrong');
})



// stay alive, listen, keep ears open for any request. rather than running one time only and stopping. "by virtue of listening, we keep it alive"
app.listen(PORT, () => console.log(`listening on ${PORT}`));