// Event listener to form
document.querySelector('form').addEventListener('submit', handleSubmit);

// Main function
function handleSubmit(event) {
  event.preventDefault();
  // Get entered city and country code
  const city = document.getElementById('city').value;
  const countryCode = document.getElementById('country-code').value;
  // Send input values to server endpoint
  provideGeoNames({ city, countryCode });
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
    console.log(res);
    return res;
  } catch (error) {
    console.log('error', error);
  }
};
