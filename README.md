# City Explorer

**Author**:

Doug Klemp
Liz Mahoney

**Version**:
1.0.0

## Overview

A city explorer application to gather information based from users input location. Displays location, eventbrite info, yelp, hiking information.

## Getting Started

Install the following on command line:

  `npm install express dotenv superagent`

On terminal, run

`node server.js`

`nodemon`

Then on browser, type URL `http://localhost:3000`

- Enter deployment link below on the browser, press enter
- Enter a city, then it should render the appropriate map with city information.

## Deployment link

https://safe-headland-81624.herokuapp.com

## Architecture
Node, JS, Express

## Change Log

- 5-2-19
  - Install and require npm psql in server.js file.
  - Update environment variables throughout server.js
  - Create schema.sql file
  - Create client to setup db on local and Heroku
  - Create heroku db.

- 5-1-19
  - Refactored weather api to pull real data from Darksky.
  - Created event constructor
  - Add event helper function
  - Created `.get` for event and weather api
  - installed superagent for request/response
  
- 4-30-19
  - Add weather constructor
  - Add location constructor
  - Create .get for weather and location

# Features 
```
Number and name of feature: Setup database with psql & Heroku

Estimate of time needed to complete: 3hr

Start time: 900am

Finish time: 1030am

Actual time needed to complete: 1 hr 30 mins
```

```
Number and name of feature: Implement weather API

Estimate of time needed to complete: 4hr

Start time: 9am

Finish time: 1003

Actual time needed to complete: 1 hr
```

```
Number and name of feature: Implement eventbrite API

Estimate of time needed to complete: 2 hr

Start time: 10:04am

Finish time: 11:00am

Actual time needed to complete: <1hr
```