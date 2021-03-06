// Setup empty JS object to act as endpoint for all routes
const projectData = {};

const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

// Empty JS array to act as endpoint for all routes
const travelData = [];

// Start application
const app = express();

// Setup middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

// Initialize main project folder
// app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static('dist'));

// Setup server
const port = 3000;
app.listen(port, () => {
  console.log(`Running on localhost ${port}.`);
});

// GET route
app.get('/all', getData);

function getData(req, res) {
  res.send('GET Succeeded');
}

// Main Function, POST route
app.post('/add', postData);

function postData(req, res) {
  getGeoNames(req.body);

  res.send({ status: 'POST Succeeded' });
}

// GET function for GeonamesAPI
function getGeoNames({ city, countryCode, countdown }) {
  const baseUrlAPI = 'http://api.geonames.org/searchJSON?';
  const maxRows = 20;
  const username = process.env.USERNAME;
  const completeUrlAPI = `${baseUrlAPI}q=${city}&country=${countryCode}&maxRows=${maxRows}&username=${username}`;
  // Call generic function to get data from GeonamesAPI
  return (
    makeRequest(completeUrlAPI)
      // Parse data from GeoNamesAPI. Object descontruction is used here to access geonames property
      .then(({ geonames }) => {
        const [{ lat, lng, name, adminName1, countryName }] = geonames; // Array and object descontruction
        parsedData = {
          latitude: lat,
          longitude: lng,
          city: name,
          state: adminName1,
          country: countryName,
          countdown,
        };
        console.log(parsedData);
      })
  );
}

// Generic request function GET/POST data from external WebAPI
const makeRequest = async (url, data) => {
  let options = {};
  if (data) {
    options = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  }
  const response = await fetch(url, options);

  try {
    const res = await response.json();
    return res;
  } catch (error) {
    console.log('error', error);
  }
};
