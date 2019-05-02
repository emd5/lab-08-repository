CREATE TABLE location (
  id SERIAL,
  latitude DECIMAL,
  longitude DECIMAL,
  formatted_query TEXT,
  search_query TEXT
);

CREATE TABLE weather (
  id SERIAL,
  forecast TEXT,
  time TEXT,
  search_query TEXT
);

CREATE TABLE event (
  id SERIAL,
  link TEXT,
  name TEXT,
  event_date TEXT,
  summary TEXT,
  search_query TEXT
);