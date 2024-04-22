import { createClient } from'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://uinwygivzoztiewobtld.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbnd5Z2l2em96dGlld29idGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1NjUyODYsImV4cCI6MjAyOTE0MTI4Nn0.ImDYy9dwONktPysI9c7eKgfkMe_uwyjSADCUZd67Jps')
//people
async function searchPeople(query) {
  try {
      let { data, error, status } = await supabase
          .from('People')
          .select('*')
          .or(`Name.ilike.%${query}%,LicenseNumber.ilike.%${query}%`);         

      console.log('Response status:', status); 
      console.log('Error:', error); 
      if (error) throw error;
      if (data.length === 0) {
          document.getElementById('people-results').innerHTML = '<p>No results found</p>';
      } else {
          updatePeopleResults(data); 
      }
  } catch (error) {
      console.error('Error fetching people:', error);
      document.getElementById('people-results').innerHTML = `<p>Error fetching data: ${error.message}</p>`;
  }
}

function updatePeopleResults(people) {
  const resultsContainer = document.getElementById('people-results');
  resultsContainer.innerHTML = people.map(person =>
      `<div>Name: ${person.Name}, License Number: ${person.LicenseNumber}</div>`
  ).join('');
}

//vehicles
async function searchVehicle(registrationNumber) {
  try {
      let { data, error } = await supabase
          .from('Vehicles') 
          .select('*')
          .ilike('VehicleID', `%${registrationNumber}%`); 

      if (error) throw error;

      if (data.length === 0) {
          document.getElementById('vehicle-results').innerHTML = '<p>No results found</p>';
      } else {
          updateVehicleResults(data);
      }
  } catch (error) {
      console.error('Error fetching vehicles:', error);
      document.getElementById('vehicle-results').innerHTML = `<p>Error fetching data: ${error.message}</p>`;
  }
}

function updateVehicleResults(vehicles) {
  const resultsContainer = document.getElementById('vehicle-results');
  resultsContainer.innerHTML = vehicles.map(vehicle =>
      `<div>Vehicle ID: ${vehicle.VehicleID}, Make: ${vehicle.Make}, Model: ${vehicle.Model}, Colour: ${vehicle.Colour}</div>`
  ).join('');
}



document.addEventListener('DOMContentLoaded', () => {
  const searchPeopleForm = document.getElementById('search-people-form');
  if (searchPeopleForm) {
    searchPeopleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('search-name').value;
      searchPeople(name);
    });
  }

  const searchVehicleForm = document.getElementById('search-vehicles-form');
  if (searchVehicleForm) {
    searchVehicleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const registrationNumber = document.getElementById('search-rego').value;
      searchVehicle(registrationNumber);
    });
  }
});