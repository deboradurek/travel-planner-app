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
  const presentDate = new Date().getTime();
  const futureDate = new Date(travelDate).getTime();
  const countdown = Math.ceil((futureDate - presentDate) / (1000 * 60 * 60 * 24));
  console.log(countdown);
  // Send input values to server endpoint
  provideGeoNames({ city, countryCode, countdown });
}

// Function to POST input values, pointing to local server
const provideGeoNames = async (data = {}) => {
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
    return res;
  } catch (error) {
    console.log('error', error);
  }
};

export { handleSubmit };
