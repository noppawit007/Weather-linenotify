import React, { useState } from "react";
import WeatherInfo from "../WeatherComponents/WeatherInfo";
import WeatherInput from "../WeatherComponents/WeatherInput";
import GetWeatherButton from "../ButtonComponents/GetWeatherButton";

function WeatherPage(props) {
  const { weatherStatus } = props;
  const [weatherData, setWeatherData] = useState({
    tempF: null,
    tempC: null,
    humidity: null,
    desc: null,
    city: null
  });

  return (
    <section className="weather-container">
      <WeatherInput
        setWeatherData={setWeatherData}
        weatherStatus={weatherStatus}
      />
      <section className="weather-info">
        {weatherData.tempF ? (
          <WeatherInfo data={weatherData} />
        ) : (
          <h3 className="content-title no-weather">
            No Weather to Display
            <i className="material-icons">wb_sunny</i>
          </h3>
        )}

        <p className="del-mg-bottom">Do you want to get daily weather info?</p>
        <p className="del-mg-bottom">↓</p>

        <div>
          <GetWeatherButton props={props} />
        </div>
      </section>
    </section>
  );
}

export default WeatherPage;
