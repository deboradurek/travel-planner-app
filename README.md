# Project Introduction

This project is the last requirement for the Front End Web Developer Nanodegree Program, by Udacity.

Its goal is to provide practice with:

- Project Structure (HTML) and Styles (CSS).
- Sass.
- JavaScript.
- Node.js and Express.
- Webpack, Loaders and Plugins.
- Use of multiple inter-connecting external APIs:
    - [Geonames](http://www.geonames.org/) API to fetch location data such as latitute and longitude.
    - [Weatherbit](https://www.weatherbit.io/) to fetch current weather and weather forecast.
    - [Pixabay](https://pixabay.com/) API to fetch image of city and country.
- Service Workers

---

## Project Details

This project is a **Travel Planner** application that obtains a desired trip location and some date from the user. It then displays some weather details and an image of the location using information obtained from external APIs.

_Country Code_:
- Optional input field. It makes sure that the desired city is fetch from the Geonames API

_Departure Date_:
- If user enters a departure date less than 7 days away, response will show current weather.
- If date is more than 7 days away, though, response will show forecast for the next 16 days.

 ---

## Project Extensions

Additional features implemented:

- Pull in an image for the country from Pixabay API when the entered location brings up no results (good for obscure localities).

- Incorporate icons into forecast.

---

## Getting Started

Follow the important steps bellow to have the project running in the correct mode:

- Install all project dependencies: `$ npm install`

- Build project using production mode: `$ npm run build-prod`;
  _or_
- Build project using development mode on express: `$ npm run build-dev`;
  _or_
- Run project using development mode on webpack server: `$ npm run dev`;

- Start the server: `$ npm run start`


---

## Testing the Code

You can also run tests for javascript files. To do this, do the following:

- Run tests using jest: `$ npm run test`
