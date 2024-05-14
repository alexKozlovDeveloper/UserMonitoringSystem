import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';

import '../../styles/WeatherForecastPage.css'

const WeatherForecast = () => {

  const navigate = useNavigate();

  const [forecasts, setForecasts] = useState();

  useEffect(() => {
    populateWeatherData();
  }, []);

  const contents = forecasts === undefined
    ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
    :
    <div className='items-container'>
      <table className="table table-striped" aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map(forecast =>
            <tr key={forecast.date}>
              <td>{forecast.date}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>;

  return (
    <div>
      <Header />
      <h1 id="tabelLabel">Weather forecast</h1>
      {contents}
    </div>
  );

  async function populateWeatherData() {
    try {
      const response = await fetch('weatherforecast');

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
        }
      }

      const data = await response.json();

      setForecasts(data);
    } catch (error) {
      // TODO: log error
    }
  }
};

export default WeatherForecast;