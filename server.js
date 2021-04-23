'use strict'

// ==================== dependencies ===================== //
const express = require('express');
require('dotenv').config();
const cors = require('cors');

// weather data is an object
const getWeatherHandler = require('./weather');
const getMovieHandler = require('./movie');


// ==================== set up app ===================== //
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());


// ==================== routes ===================== //
app.get('/', (request, response) => {
  //response object calls its send method
  response.status(200).send('hello!');
});

// real-time weather, learned during lecture
app.get('/weather', getWeatherHandler);
// movie database
app.get('/movies', getMovieHandler);
// // every other GET request will result in a 404

app.get('*', (request, response) => {
  response.status(400, 404, 500).send('error: something went wrong');
})


// ==================== listen ===================== //

// KEEP AT BOTTOM - stay alive, listen, keep ears open for any request. rather than running one time only and stopping. "by virtue of listening, we keep it alive"
app.listen(PORT, () => console.log(`Listening on ${PORT}`));