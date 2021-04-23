'use strict'

require('dotenv').config();
const superagent = require('superagent');

// ============ Memory Database =========== //
const inMemoryDB = {};


// ============ Movie Handler =========== //
async function getMovieHandler(request, response) {


  // ==== API info ==== //
  const cityName = request.query.cityName;

  try {
    const movieAlreadyFound = inMemoryDB[cityName] !== undefined;

    if (movieAlreadyFound) {
      const topMovies = inMemoryDB[cityName];
      response.status(200).send(topMovies);

    } else {
      const movieKey = process.env.MOVIE_API_KEY;
      const url = `https://api.themoviedb.org/3/search/movie?query=${cityName}&api_key=${movieKey}`;

      const movieResponse = await superagent.get(url);
      const movieObject = JSON.parse(movieResponse.text);
      const movieArray = movieObject.results;

      const topMovies = movieArray.map(movie => new Movies(movie))
      inMemoryDB[cityName] = topMovies;
      response.status(200).send(topMovies);
    }
  } catch (error) {
    console.log(error);
    response.status(500).send('Oops, Movies broke.')
  }
}


// ========== constructor/class ========== //
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


module.exports = getMovieHandler;
