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
  document.getElementById('city-name').innerHTML = `<p>${allData.city}</p>`;
  // document.getElementById('state').innerHTML = `<p>${allData.state}</p>`;
  document.getElementById('country').innerHTML = `<p>${allData.state} - ${allData.country}</p>`;
  document.getElementById('travel-date').innerHTML = `<p>Travel Date: ${allData.travelDate}</p>`;
  document.getElementById('countdown').innerHTML = `<p>${allData.countdown} day(s) to go!</p>`;
  document.getElementById('temperature').innerHTML = `<p>${Math.round(
    allData.dataCurrentWeather.temperature
  )} °C</p>`;
  document.getElementById('humidity').innerHTML = `<p>${allData.dataCurrentWeather.humidity} %</p>`;
  document.getElementById('clouds').innerHTML = `<p>${allData.dataCurrentWeather.clouds} %</p>`;
  document.getElementById(
    'wind-speed'
  ).innerHTML = `<p>${allData.dataCurrentWeather.windSpeed} m/s</p>`;
  document.getElementById(
    'weather-description'
  ).innerHTML = `<p>${allData.dataCurrentWeather.weatherDescription}</p>`;
  document.getElementById(
    'weather-code'
  ).innerHTML = `<p>${allData.dataCurrentWeather.weatherCode}</p>`;
  document.getElementById('trip-image').src = allData.webformatURL;
}

export { handleSubmit };
