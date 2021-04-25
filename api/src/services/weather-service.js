const axios = require('axios');

/**
 *
 * @param {int} temp
 */
const convertToFarenheit = (temp) =>
  ((temp - 273.15) * (9.0 / 5.0) + 32).toFixed(0);

/**
 *
 * @param {int} temp
 */
const convertToCelsius = (temp) => (temp - 273.15).toFixed(0);

async function getWeather(zipCode, country) {
  try {
    return axios
      .post(
        `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${country}&appid=${'78e81a9a7425b24350cdb14a615c1edf '}`
      )
      .then(async ({ data: { main, weather, name } }) => {
        let tempreture =
          '\n============== \n' +
          'Weather Info:\n' +
          '============== \n' +
          ` City: ${name}\n` +
          ` Weather: ${weather[0].main}\n` +
          ` TempF: ${convertToFarenheit(main.temp)} \n` +
          ` TempC: ${convertToCelsius(main.temp)}\n` +
          ` Humidity: ${main.humidity}\n\n` +
          ' Have a nice day :)';

        return tempreture;
      })
      .catch((err) => {
        if (err.response.statusText === 'Not Found') {
          let notFoundErr =
            '\n Weather Info \n' +
            ' Your input location seems invalid. \n' +
            ' Please try another zipcode :)';

          return notFoundErr;
        }
        return err;
      });
  } catch (err) {
    console.log(err);
  }
}

async function getSGWeather() {
  try {
    return axios
      .post(
        `https://api.openweathermap.org/data/2.5/weather?q=Singapore,sg&appid=${'78e81a9a7425b24350cdb14a615c1edf '}`
      )
      .then(async ({ data: { main, weather, name } }) => {
        let tempreture =
          '\n============== \n' +
          'Weather Info:\n' +
          '============== \n' +
          ` City: ${name}\n` +
          ` Weather: ${weather[0].main}\n` +
          ` TempF: ${convertToFarenheit(main.temp)} \n` +
          ` TempC: ${convertToCelsius(main.temp)}\n` +
          ` Humidity: ${main.humidity}\n\n` +
          ' Have a nice day :)';

        return tempreture;
      })
      .catch((err) => {
        if (err.response.statusText === 'Not Found') {
          let notFoundErr =
            '\n Weather Info \n' +
            ' Your input location seems invalid. \n' +
            ' Please try another zipcode :)';

          return notFoundErr;
        }
        return err;
      });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getWeather,
  getSGWeather,
};
