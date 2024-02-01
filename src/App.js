import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import './App.css';

function App() {
  const { control, watch } = useForm();
  const [allBodies, setAllBodies] = useState([]);
  const [filteredBodies, setFilteredBodies] = useState([]);
  const [selectedBody, setSelectedBody] = useState(null);
  const [bodyDetails, setBodyDetails] = useState(null);
  const isPlanetChecked = watch('isPlanet');
  const gravityValue = watch('gravity');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://api.le-systeme-solaire.net/rest/bodies/');
        const data = await response.json();
        setAllBodies(data.bodies);
        const filtered = data.bodies.filter(body => {
          const meetsPlanetCriteria = isPlanetChecked ? body.isPlanet : true;
          const meetsGravityCriteria = body.gravity <= gravityValue;
          return meetsPlanetCriteria && meetsGravityCriteria;
        });
        setFilteredBodies(filtered);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }
    fetchData();
  }, [isPlanetChecked, gravityValue]);

  useEffect(() => {
    const filtered = allBodies.filter(body => {
      const meetsPlanetCriteria = isPlanetChecked ? body.isPlanet : true;
      const meetsGravityCriteria = body.gravity <= gravityValue;
      return meetsPlanetCriteria && meetsGravityCriteria;
    });
    setFilteredBodies(filtered);
  }, [isPlanetChecked, gravityValue, allBodies]);

  useEffect(() => {
    async function fetchBodyDetails() {
      if (selectedBody) {
        try {
          const response = await fetch(`https://api.le-systeme-solaire.net/rest/bodies/${selectedBody}`);
          const data = await response.json();
          setBodyDetails(data);
        } catch (error) {
          console.error('Error fetching body details: ', error);
          setBodyDetails(null);
        }
      }
    }
    fetchBodyDetails();
  }, [selectedBody]);

  return (
    <div className="app-container">
      <header>
        <h1>RHOBS Challenge</h1>
      </header>
  
      <div className="main-content">
        <div className="filter-section">
          <label className="filter-label">
            Is Planet
            <Controller name="isPlanet" control={control} render={({ field }) => <input type="checkbox" {...field} />} />
          </label>
  
          <label className="filter-label">
            Gravity
            <Controller name="gravity" control={control} render={({ field }) => <input type="range" {...field} />} />
          </label>
        </div>
  
        <div className="select-section">
          <label className="select-label">
            Bodies:
            <select onChange={e => setSelectedBody(e.target.value)}>
              {filteredBodies.map(body => (
                <option key={body.id} value={body.id}>
                  {body.name}
                </option>
              ))}
            </select>
          </label>
        </div>
  
        <div className="info-section">
          <h2>Info on the body</h2>
          {bodyDetails ? (
            <div className="info-body">
              <p>Name: {bodyDetails.name}</p>
              <p>Gravity: {bodyDetails.gravity}</p>
            </div>
          ) : (
            <p className="info-message">Select a body to see its details.</p>
          )}
        </div>
      </div>
    </div>
  );  
}

export default App;
