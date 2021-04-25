const schedule = require('node-schedule');
const { getWeather, getSGWeather } = require('../services/weather-service');

var schedules = {};

function scheduler(
  uid,
  lineSdk,
  zcode,
  country,
  accessToken,
  { hour, minute },
  userTimeZone
) {
  try {
    var rule = new schedule.RecurrenceRule();
    rule.hour = hour;
    rule.minute = minute;
    rule.tz = userTimeZone;

    // Use cancel() instead of reschedule because user might be apply different zipcode.
    if (schedules[`${uid}`]) {
      schedules[`${uid}`].cancel();
    }

    schedules[`${uid}`] = schedule.scheduleJob(rule, function () {
      // Try sending weather info
      if (zcode === 65) {
        // for singapore. Only one locatgion is supported for Singapore
        getSGWeather()
          .then((data) => {
            lineSdk.notify_contents(accessToken, data);
          })
          .catch((err) => console.log(err));
      } else {
        getWeather(zcode, country)
          .then((data) => {
            lineSdk.notify_contents(accessToken, data);
          })
          .catch((err) => console.log(err));
      }
    });
  } catch (err) {
    console.log(err);
    return 'Error';
  }
}

function cancelScheduler(uid) {
  try {
    if (schedules[`${uid}`] === undefined) {
      return 'No schedule set';
    }
    schedules[`${uid}`].cancel();
    schedules[`${uid}`] = undefined;
    return 'Success';
  } catch (err) {
    console.log(err);
    return 'Error';
  }
}

module.exports = {
  scheduler,
  cancelScheduler,
};
