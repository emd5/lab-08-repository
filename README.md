# City Explorer

**Author**:

Jorie Fernandez
Liz Mahoney

**Version**:
1.0.0

## Overview

A city explorer application to gather information based from users input location. Displays location, Eventbrite info, yelp, hiking information.

## Getting Started

Install the following on command line:

  `npm install express dotenv superagent`

On terminal, run

`node server.js`

`nodemon`

Then on browser, type URL `http://localhost:3000`


## Architecture
Node, JS, Express

## Change Log

- 5-1-19
  - Refactored weather api to pull real data from Darksky.
  - Created event constructor
  - Add event helper function
  - Created .get for event and weather api
    - installed superagent for request/response
  
- 4-30-19
  - Add weather constructor
  - Add location constructor
  - Create .get for weather and location

# Features 

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