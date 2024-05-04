import { createClient } from'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://uinwygivzoztiewobtld.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbnd5Z2l2em96dGlld29idGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1NjUyODYsImV4cCI6MjAyOTE0MTI4Nn0.ImDYy9dwONktPysI9c7eKgfkMe_uwyjSADCUZd67Jps')
//people
async function searchPeople(query) {
  try {
      let { data, error, status } = await supabase
          .from('People')
          .select('*')
          .or(`Name.ilike.%${query}%`,`LicenseNumber.ilike.%${query}%`);         

      if (error) throw error;
      if (data.length === 0) {
          document.getElementById('results').innerHTML = '<p>No results found</p>';
      } else {
          updatePeopleResults(data); 
          let message = document.getElementById("message")
          message.innerHTML = ''
          message.innerHTML = "Search successful"
      }
  } catch (error) {
      console.error('Error fetching people:', error);
      document.getElementById('results').innerHTML = `<p>Error fetching data: ${error.message}</p>`;
  }
}

function updatePeopleResults(people) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = people.map(person =>
      `<div>
      <p>PersonID: ${person.PersonID}</p>
      <p>Name: ${person.Name}</p>
      <p>Address: ${person.Address}</p>
      <p>Date of Birth: ${person.DOB}</p>
      <p>License Number: ${person.LicenseNumber}</p>
      <p>ExpiryDate: ${person.ExpiryDate}</p>
      </div>`
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
          document.getElementById('results').innerHTML = '<p>No results found</p>';
      }
          else {
            updateVehicleResults(data); 
            let message = document.getElementById("message")
            message.innerHTML = ''
            message.innerHTML = "Search successful"
        }
  } catch (error) {
      console.error('Error fetching vehicles:', error);
      document.getElementById('results').innerHTML = `<p>Error fetching data: ${error.message}</p>`;
  }
}

function updateVehicleResults(vehicles) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = vehicles.map(vehicle =>
      `<div>Vehicle ID: ${vehicle.VehicleID}, Make: ${vehicle.Make}, Model: ${vehicle.Model}, Colour: ${vehicle.Colour}</div>`
  ).join('');
}


async function addVehicle() {
  const rego = document.getElementById('rego').value;
  const make = document.getElementById('make').value;
  const model = document.getElementById('model').value;
  const colour = document.getElementById('colour').value;
  const owner = document.getElementById('owner').value;

  try {
      const { data, error } = await supabase
          .from('Vehicles') 
          .insert([{
              VehicleID: rego, 
              Make: make,
              Model: model,
              Colour: colour,
              Owner: owner
          }]);
      if (error) {
          throw error;
      }
      else{
      // Updating the message if succeed
      document.getElementById('message').textContent = 'Vehicle added successfully';
      console.log('Added vehicle:', data); 
    }
  } catch (error) {
      console.error('Error adding vehicle:', error);
      document.getElementById('message').textContent = `Error adding vehicle: ${error.message}`;
  }
}

async function addPerson() {
  const personId = document.getElementById('personid').value;
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const dob = document.getElementById('dob').value;
  const license = document.getElementById('license').value;
  const expire = document.getElementById('expire').value;

  const check = await supabase
  .from('People')
  .select('PersonID')
  .eq('PersonID', personId)
  .single();

  if (check.data) {
    document.getElementById('message').textContent = 'Error adding person: PersonID already exists';
    return; 
}
  try {
      const { data, error } = await supabase
          .from('People')
          .insert([{
              PersonID: personId,
              Name: name,
              Address: address,
              DOB: dob,
              LicenseNumber: license,
              ExpiryDate: expire
          }]);

      if (error) {
          throw error;
      }

      document.getElementById('message').textContent = 'Vehicle added successfully';
  } catch (error) {
      console.error('Error adding person:', error);
      document.getElementById('message').textContent = `Error adding person: ${error.message}`;
  }
}




document.addEventListener('DOMContentLoaded', () => {
  const searchPeopleForm = document.getElementById('search-people-form');
  if (searchPeopleForm) {
    searchPeopleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      searchPeople(name);
    });
  }

  const searchVehicleForm = document.getElementById('search-vehicles-form');
  if (searchVehicleForm) {
    searchVehicleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const registrationNumber = document.getElementById('rego').value;
      searchVehicle(registrationNumber);
    });
  }

  const addVehicleForm = document.getElementById('add-vehicle-form');
    if (addVehicleForm) {
        addVehicleForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the default form submission
            addVehicle(); // Call the addVehicle function when the form is submitted
        });
    }
  const addPersonForm = document.getElementById('add-owner-form');
    if (addPersonForm) {
        addPersonForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addPerson();
        });
    }
});
