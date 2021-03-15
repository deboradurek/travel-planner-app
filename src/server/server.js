// Setup empty JS object to act as endpoint for all routes
let projectData = {};

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

async function postData(req, res) {
  projectData = {};
  try {
    await getGeoNames(req.body);
    await getWeatherbit();
    // await getPixabay();
    res.send(projectData);
  } catch (error) {
    res.status(503).send({
      message: error.message,
    });
  }
}

// GET function for Geonames API
function getGeoNames({ city, countryCode, travelDate, countdown }) {
  const baseUrlAPI = 'http://api.geonames.org/searchJSON?';
  const cityName = encodeURIComponent(city);
  const maxRows = 10;
  const username = process.env.USERNAME;
  const completeUrlAPI = `${baseUrlAPI}q=${cityName}&country=${countryCode}&maxRows=${maxRows}&username=${username}`;
  // Call generic function to get data from Geonames API
  return (
    makeRequest(completeUrlAPI)
      // Parse data from GeoNames API. Object descontruction is used here to access geonames property
      .then(({ geonames, totalResultsCount }) => {
        if (totalResultsCount === 0) {
          throw new Error('City not found.');
        }

        const [{ lat, lng, name, adminName1, countryName }] = geonames; // Array and object descontruction

        // Save received data in server endpoint
        projectData = {
          latitude: lat,
          longitude: lng,
          city: name,
          state: adminName1,
          country: countryName,
          travelDate,
          countdown,
        };
      })
  );
}

// GET function for Weatherbit API
function getWeatherbit() {
  const lat = projectData.latitude;
  const lon = projectData.longitude;
  const key = process.env.WEATHERBIT_API_KEY;

  // Check if travel date is within 7 days to use current weather
  if (projectData.countdown <= 7) {
    let baseUrlAPI = 'https://api.weatherbit.io/v2.0/current?';
    let completeUrlAPI = `${baseUrlAPI}&lat=${lat}&lon=${lon}&key=${key}`;

    // Call generic function to get data from Weatherbit API
    return (
      makeRequest(completeUrlAPI)
        // Parse data from Weatherbit API for current weather
        .then(({ data }) => {
          const [{ city_name, datetime, temp, rh, clouds, wind_spd, wind_cdir, weather }] = data;

          // Save received data in server endpoint
          projectData = {
            ...projectData,
            dataWeather: [
              {
                cityName: city_name,
                dateTime: datetime.slice(0, 10),
                temperature: temp,
                humidity: rh,
                clouds,
                windSpeed: wind_spd,
                windDirection: wind_cdir,
                weatherIcon: weather.icon,
                weatherDescription: weather.description,
              },
            ],
          };
        })
    );
  } else if (projectData.countdown > 7) {
    let baseUrlAPI = 'https://api.weatherbit.io/v2.0/forecast/daily?';
    let completeUrlAPI = `${baseUrlAPI}&lat=${lat}&lon=${lon}&key=${key}`;
    // Call generic function to get data from Weatherbit API
    return (
      makeRequest(completeUrlAPI)
        // Parse data from Weatherbit API for 16 day weather forecast
        .then(({ data }) => {
          const newDataArray = data.map((obj) => {
            const { datetime, temp, rh, clouds, wind_spd, wind_cdir, weather } = obj;

            return {
              dateTime: datetime,
              temperature: temp,
              humidity: rh,
              clouds,
              windSpeed: wind_spd,
              windDirection: wind_cdir,
              weatherIcon: weather.icon,
              weatherDescription: weather.description,
            };
          });

          // Save received data in server endpoint
          projectData = {
            ...projectData,
            dataWeather: newDataArray,
          };
        })
    );
  }
}

// GET function for Pixabay API
function getPixabay() {
  const baseUrlAPI = 'https://pixabay.com/api/?';
  const key = process.env.PIXABAY_API_KEY;
  const searchTerm = encodeURIComponent(projectData.city);
  const imageType = 'photo';
  const category = 'buildings';
  const qtyPerPage = 3;
  const orientation = 'horizontal';
  let completeUrlAPI = `${baseUrlAPI}key=${key}&q=${searchTerm}&image_type=${imageType}&category=${category}&per_page=${qtyPerPage}&orientation=${orientation}`;

  // Call generic function to get an image of a city
  return makeRequest(completeUrlAPI).then(({ hits, total }) => {
    // Check if request gets an error
    if (total === 0) {
      // If error, look for an image of the country instead
      const searchForCountry = encodeURIComponent(projectData.country);
      completeUrlAPI = `${baseUrlAPI}key=${key}&q=${searchForCountry}&image_type=${imageType}&per_page=${qtyPerPage}&orientation=${orientation}`;
      return makeRequest(completeUrlAPI).then(({ hits, total }) => {
        // If attempt is unsuccessful, throw an error
        if (total === 0) {
          throw new Error('Image not found.');
        }
        // If attempt is successful, add country image to endpoind
        let [{ webformatURL }] = hits;
        projectData = {
          ...projectData,
          webformatURL,
        };
        console.log(projectData);
      });
    }

    // If there is no error, add city image to endpoint
    let [{ webformatURL }] = hits;
    projectData = {
      ...projectData,
      webformatURL,
    };
    console.log(projectData);
  });
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

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  try {
    const res = await response.json();
    return res;
  } catch (error) {
    console.log('error', error);
  }
};
