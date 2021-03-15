let currentWeather;

// Main function
function handleSubmit(event) {
  event.preventDefault();
  // Get user input
  const city = document.getElementById('city').value;
  const countryCode = document.getElementById('country-code').value;
  const travelDate = document.getElementById('travelDate').value;
  // Create countdown
  const presentDate = new Date().setHours(0);
  const futureDate = new Date(travelDate).setHours(23);
  const countdown = Math.ceil((futureDate - presentDate) / (1000 * 60 * 60 * 24));
  // Send input values to server endpoint
  provideUserInput({ city, countryCode, travelDate, countdown }).then(
    ({ dataWeather, ...moreData }) => {
      currentWeather = dataWeather[0];
      updateDashboardUI(moreData);
      updateSummaryUI(dataWeather);
    }
  );
}

// Function to POST user input values, pointing to local server
const provideUserInput = async (data = {}) => {
  const response = await fetch('http://localhost:3000/add', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  try {
    const res = await response.json();
    // Validate if response is not successful
    if (response.status !== 200) {
      alert(res.message);
      return null;
    }
    return res;
  } catch (error) {
    console.log('error', error);
  }
};

// Function to update weather dashboard using only moreData
function updateDashboardUI(moreData) {
  document.querySelector('.section-results').classList.remove('hidden');

  document.getElementById('city-name').innerHTML = moreData.city;
  document.getElementById('country').innerHTML = `${moreData.state} - ${moreData.country}`;

  document.getElementById('countdown-icon').src = './src/client/media/fast-time.svg';
  document.getElementById('countdown-text').innerHTML = 'days to go!';
  document.getElementById('countdown').innerHTML = moreData.countdown;

  // document.getElementById('trip-image').src = moreData.webformatURL;

  updateCurrentWeatherUI();
}

// Function to complement updateDashboardUI and updateSummaryUI using global variable currentWeather
function updateCurrentWeatherUI() {
  document.getElementById('forecast-date-icon').src = './src/client/media/calendar.svg';
  document.getElementById('forecast-date-title').innerHTML = 'Forecast for';
  document.getElementById('forecast-date').innerHTML = currentWeather.dateTime;

  document.getElementById('temperature-icon').src = './src/client/media/thermometer.svg';
  document.getElementById('temperature').innerHTML = `${Math.round(
    currentWeather.temperature
  )}<span class="celcius"> °C</span>`;

  // Weather description
  document.getElementById('weather-icon0').src = './src/client/media/forecast-black.svg';
  const src = `https://www.weatherbit.io/static/img/icons/${currentWeather.weatherIcon}.png`;
  document.getElementById('weather-icon').src = src;
  document.getElementById('weather-description').innerHTML = currentWeather.weatherDescription;

  // Extra info
  document.getElementById('extra-icon').src = './src/client/media/weathercock.svg';

  document.getElementById('humidity-icon').src = './src/client/media/humidity.svg';
  document.getElementById('humidity').innerHTML = `${Math.round(currentWeather.humidity)} %`;

  document.getElementById('clouds-icon').src = './src/client/media/cloud.svg';
  document.getElementById('clouds').innerHTML = `${currentWeather.clouds} %`;

  document.getElementById('wind-icon').src = './src/client/media/wind.svg';
  document.getElementById('wind-speed').innerHTML = `${Math.round(currentWeather.windSpeed)} m/s`;

  document.getElementById('wind-dir-icon').src = './src/client/media/compass.svg';
  document.getElementById('wind-dir').innerHTML = currentWeather.windDirection;
}

// Function to update summary
function updateSummaryUI(dataWeather) {
  const resultsSummaryContainer = document.getElementById('results-summary');
  resultsSummaryContainer.innerHTML = '';
  dataWeather.forEach((objectWeather, index) => {
    const newDiv = document.createElement('div');
    newDiv.classList.add('widget-summary-ctn');

    if (index === 0) {
      newDiv.classList.add('selected-widget');
    }

    newDiv.addEventListener('click', function () {
      document.querySelector('.selected-widget').classList.remove('selected-widget');
      this.classList.add('selected-widget');

      currentWeather = objectWeather;
      updateCurrentWeatherUI();
    });

    const src = `https://www.weatherbit.io/static/img/icons/${objectWeather.weatherIcon}.png`;
    newDiv.innerHTML = `<span class="date-summary">${objectWeather.dateTime.slice(5, 10)}</span>
    <img class="icon-summary" src="${src}">
    <span class="temperature-summary">${Math.round(
      objectWeather.temperature
    )}<span class="celcius-summary"> °C</span></span>`;
    resultsSummaryContainer.appendChild(newDiv);
  });
}

export { handleSubmit };
