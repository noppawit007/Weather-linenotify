import React from 'react';

function WeatherInfo({ data: { tempC, tempF, humidity, desc, city } }) {
  return (
    <>
      <div className="weather-info-compotnent">
        <h3>{desc}</h3>
        <section className="weather-data-flex">
          <div className="header-description">
            <h4>City</h4>
            <p>{city}</p>
          </div>
          <div className="header-description">
            <h4>Tempereture</h4>
            <p>
              <span>
                {tempF}
                <span className="degree-symbol" /> F /{' '}
              </span>
              <span>
                {tempC}
                <span className="degree-symbol" /> C
              </span>
            </p>
          </div>
          <div className="header-description">
            <h4>Humidity</h4>
            <p>{humidity}%</p>
          </div>
        </section>
      </div>
    </>
  );
}

export default WeatherInfo;
