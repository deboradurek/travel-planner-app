const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

// Empty JS array to act as endpoint for all routes
const travelData = [];

// Start application
const app = express();

// Setup middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Initialize main project folder
app.use(express.static('dist'));

// Setup server
const port = 8081;
app.listen(port, () => {
  console.log(`Running on localhost ${port}.`);
});

// GET route
app.get('/all', getData);

function getData(req, res) {
  res.send('POST Succeeded');
}

// POST route
app.post('/add', postData);

function postData(req, res) {
  res.send({ status: 'GET Succeeded' });
}
