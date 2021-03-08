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
  console.log(countdown);
  // Send input values to server endpoint
  provideUserInput({ city, countryCode, travelDate, countdown });
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

export { handleSubmit };
