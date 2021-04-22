'use strict'

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3002;


// weather data is an object
// const weather = require('./data/weather.json');
const getWeatherHandler = require('./weather');
const getMovieHandler = require('./movie');
// const Forecast = require('./weather.js');
// const Movies = require('./movie.js');


app.use(cors());


app.get('/', (request, response) => {
  //response object calls its send method
  response.send('hello!');
});

// real-time weather, learned during lecture
app.get('/weather', getWeatherHandler);
// movie database
app.get('/movies', getMovieHandler);
// // every other GET request will result in a 404

app.get('*', (request, response) => {
  response.status(400, 404, 500).send('error: something went wrong');
})




// KEEP AT BOTTOM - stay alive, listen, keep ears open for any request. rather than running one time only and stopping. "by virtue of listening, we keep it alive"
app.listen(PORT, () => console.log(`listening on ${PORT}`));