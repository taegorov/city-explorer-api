'use strict'

require('dotenv').config();
const superagent = require('superagent');

// ============ Memory Database =========== //
const inMemoryDB = {};


// ============ Weather Handler =========== //
async function getWeatherHandler(request, response) {


// ==== API info ==== //
  const lat = request.query.lat;
  const lon = request.query.lon;

  try {
    const weatherAlreadyFound = inMemoryDB[lat + lon] !== undefined;

    if (weatherAlreadyFound) {
      const forecasts = inMemoryDB[lat + lon];
      response.status(200).send(forecasts);
      console.log('in memory db', inMemoryDB);

    } else {
      const key = process.env.WEATHER_API_KEY;
      const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;

      const weatherResponse = await superagent.get(url);
      const weatherObject = JSON.parse(weatherResponse.text);
      const weatherArray = weatherObject.data;

      const forecasts = weatherArray.map(day => new WeatherDay(day))
      inMemoryDB[lat + lon] = forecasts;
      response.status(200).send(forecasts);
    }
  } catch (error) {
    console.log(error);
    response.status(500).send('Oops! Something broke.')
  }
}


// ========== constructor/class ========== //
class WeatherDay {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
  }
}


module.exports = getWeatherHandler;
