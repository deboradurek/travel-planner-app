// Event listener to form
document.querySelector('form').addEventListener('submit', handleSubmit);

// Main function
function handleSubmit(event) {
  event.preventDefault();
  // Get user input
  const city = document.getElementById('city').value;
  const countryCode = document.getElementById('country-code').value;
  const travelDate = document.getElementById('date').value;
  // Create countdown
  const presentDate = new Date().setHours(0);
  const futureDate = new Date(travelDate).setHours(23);
  const countdown = Math.ceil((futureDate - presentDate) / (1000 * 60 * 60 * 24));
  // Send input values to server endpoint
  provideUserInput({ city, countryCode, travelDate, countdown }).then((allData) => {
    // console.log(allData);
    updateUI(allData);
  });
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
    // if (response.status !== 200) {
    //   alert(res.message);
    //   return null;
    // }
    // console.log(res);
    return res;
  } catch (error) {
    console.log('error', error);
  }
};

// Function to Update UI
function updateUI(allData) {
  document.getElementById('city-name').innerHTML = `${allData.city}`;
  document.getElementById('country').innerHTML = `${allData.state} - ${allData.country}`;

  document.getElementById('travel-date-title').innerHTML = '<p><strong>Trip Date</strong></p>';
  document.getElementById('travel-date').innerHTML = `${allData.travelDate}`;

  document.getElementById('countdown-title').innerHTML = 'days to go';
  document.getElementById('countdown').innerHTML = `${allData.countdown}`;

  document.getElementById('temperature').innerHTML = Math.round(
    allData.dataCurrentWeather.temperature
  );
  document.getElementById('temperature-title').innerHTML = '<span> °C<span>';

  document.getElementById('humidity').innerHTML = `${Math.round(
    allData.dataCurrentWeather.humidity
  )} %`;
  document.getElementById('clouds').innerHTML = `${allData.dataCurrentWeather.clouds} %`;
  document.getElementById('wind-speed').innerHTML = `${Math.round(
    allData.dataCurrentWeather.windSpeed
  )} m/s`;
  document.getElementById('weather-code').innerHTML = `${allData.dataCurrentWeather.weatherCode}`;
  document.getElementById(
    'weather-description'
  ).innerHTML = `${allData.dataCurrentWeather.weatherDescription}`;
  document.getElementById('trip-image').src = allData.webformatURL;
}

export { handleSubmit };
