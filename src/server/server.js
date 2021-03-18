// Import functions that will be used here
const { getGeoNames, getWeatherbit, getPixabay } = require('./api');

const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const express = require('express');
const cors = require('cors');

// Start application
const app = express();

// Setup middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Initialize main project folder
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
  try {
    await getGeoNames(req.body);
    await getWeatherbit();
    await getPixabay();
    res.send(projectData);
  } catch (error) {
    res.status(503).send({
      message: error.message,
    });
  }
}
