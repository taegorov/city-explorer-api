'use strict'

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const weather = require('./data/weather.json')

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;



app.get('/', (request, response) => {
  //response object calls its send method
  response.send('hello!');
});

app.get('/weather', (request, response) => {
  console.log(request.query);
  const weatherArray = weather.data.map(day => new Forecast(day));
  response.send(weatherArray);
});


function Forecast(day) {
  this.date = this.date = day.valid_date;
  this.description = day.weather.description;
}



// every other GET request will result in a 404
app.get('*', (request, response) => {
  response.status(404).send('error: something went wrong');
})

app.get('*', (request, response) => {
  response.status(500).send('error: something went wrong');
})


// stay alive, listen, keep ears open for any request. rather than running one time only and stopping. "by virtue of listening, we keep it alive"
app.listen(PORT, () => console.log(`listening on ${PORT}`));