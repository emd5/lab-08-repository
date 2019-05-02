'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');

// Load environment variables from .env file
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Database Setup
//            postgres protocol
//                            my uname/pw           domain : port/database
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

// API Routes
app.get('/location', (request, response) => {
  searchToLatLong(request.query.data)
    .then(location => response.send(location))
    .catch(error => handleError(error, response));
});

// app.get('/weather', getWeather);

// app.get('/events', getEvents);



// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// Error handler
function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).send('Sorry, something went wrong');
}

// Models
function Location(loc) {
  this.search_query = loc.body.results[0].address_components[0].long_name;
  this.formatted_query = loc.body.results[0].formatted_address;
  this.latitude = loc.body.results[0].geometry.location.lat;
  this.longitude = loc.body.results[0].geometry.location.lng;
}

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

function Event(event) {
  this.link = event.url;
  this.name = event.name.text;
  this.event_date = new Date(event.start.local).toDateString();
  this.summary = event.summary;
}

function searchToLatLong(query) {
  // check if query in database
  let sqlStatement = 'SELECT * FROM location WHERE search_query = $1;';
  let values = [ query ];
  return client.query(sqlStatement, values)
    .then( (data) => {
      // if data in db, use data from db and send result
      if(data.rowCount > 0) {
        // use data from db and send result
        console.log('we are sending data from the database');
        return data.rows[0];
      } else {
        // otherwise, grab data from gmaps, save to db, and send result
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;

        return superagent.get(url)
          .then(res => {
            let newLocation = new Location(query, res);
            let insertStatement = 'INSERT INTO location ( search_query, formatted_query, latitude, longitude ) VALUES ( $1, $2, $3, $4 );';
            let insertValues = [ newLocation.search_query, newLocation.formatted_query, newLocation.latitude, newLocation.longitude ];
            client.query(insertStatement, insertValues);
            return newLocation;
          })
          .catch(error => handleError(error));
      }
    });
}

// Weather check function
app.get('/weather', (request, response) => {
  try {
    databaseCheck(request, response, 'weather');
  } catch(error) {
    handleError(error);
  }
});
// Event check function
app.get('/events', (request, response) => {
  try {
    databaseCheck(request, response, 'event');
  } catch(error) {
    handleError(error);
  }
});

const databaseCheck = (request, response, tableName) => {
  let sqlQueryCheck = `SELECT * FROM ${tableName} WHERE search_query = $1;`;
  let values = [request.query.data.search_query]; // User input: ex "Tacoma";
  client.query(sqlQueryCheck, values)
    .then((data) => {
      if(data.rowCount > 0) {
        return response.send(data.rows);
      } else if (
        tableName === 'weather') {
        return getWeather(request);  
      } else if (
        tableName === 'events') {
        return getEvents(request);
      }
    })
    .catch((error) => {
      handleError(error);
    });
};

function getWeather(request, response) {
  const getWeatherUrl = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  superagent.get(getWeatherUrl)
    .then(result => {
      let newWeatherArr = result.body.daily.data.map(element => {
        return new Weather(element);
      });
      newWeatherArr.forEach((item) => {
        let insertStatement = `INSERT INTO weather (forecast, time, search_query) VALUES ($1, $2, $3);`;
        let insertValues = [item.forecast, item.time, request.query.data.search_query];
        client.query(insertStatement, insertValues);
      });
      return newWeatherArr;
    })
    .catch(error => handleError(error, response));
}

function getEvents(request, response) {
  const getEventsUrl = `https://www.eventbriteapi.com/v3/events/search?location.address=${request.query.data.formatted_query}`;
  superagent.get(getEventsUrl)
    .set('Authorization', `Bearer ${process.env.EVENTBRITE_API_KEY}`)
    .then(result => {
      let eventArr = result.body.events.map(element => {
        return new Event(element);
      });
      eventArr.forEach((item) => {
        console.log('item is:', item.link);
        let insertStatement = `INSERT INTO event (link, name, event_date, summary, search_query) VALUES ($1, $2, $3, $4, $5);`;
        let insertValues = [item.link, item.name, item.event_date, item.summary, request.query.data.search_query];
        client.query(insertStatement, insertValues); // add to client req.body
      })
      return eventArr;
    })
    .catch(error => handleError(error, response));
}
