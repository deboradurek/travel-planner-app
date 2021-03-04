// Event listener to form
document.querySelector('form').addEventListener('submit', handleSubmit);

// Main function
function handleSubmit(event) {
  event.preventDefault();
  // Get entered city and country code
  const city = document.getElementById('city').value;
  const countryCode = document.getElementById('country-code').value;
  // Send input values to server endpoint
}
