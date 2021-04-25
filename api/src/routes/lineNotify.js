const express = require('express');
const router = express.Router();
const line_sdk = require('../sdk/line-notify-sdk');
const secure_compare = require('secure-compare');
const md5 = require('md5');
const { scheduler, cancelScheduler } = require('../services/schedule-service');
const lineSdk = new line_sdk({
  channel_id: 'VVjuNUyBMTjsJoeILW8U8J',
  channel_secret: 'VPR0tEF6x1tgKbpGUgnlQVIIakfVslhmmC01aFq7O5T',
  callback_url: 'http://localhost:5000/line-notify/callback ',
});

router.get(
  '/token/:uid/:zipcode/:country/:selcetedHour/:selectedMinute/:c/:p',
  (req, res) => {
    try {
      const userId = req.params.uid;
      const uid = Buffer.from(`${userId}`).toString('base64');
      const zipcode = req.params.zipcode;
      const zcode = Buffer.from(`${zipcode}`).toString('base64');
      const countryParam = req.params.country;
      const country = Buffer.from(`${countryParam}`).toString('base64');
      const selcetedHour = req.params.selcetedHour;
      const hour = Buffer.from(`${selcetedHour}`).toString('base64');
      const selectedMinute = req.params.selectedMinute;
      const minute = Buffer.from(`${selectedMinute}`).toString('base64');
      const timeZoneCountry = req.params.c;
      const timeZoneProvince = req.params.p;
      const timeZoneCountryProvince = timeZoneCountry + '/' + timeZoneProvince;
      const userTimeZone = Buffer.from(`${timeZoneCountryProvince}`).toString(
        'base64'
      );
      const state = 'bm90aWZ5U3RhdGUxMjM=QUl2Y2RTd0VhMWhLb0NWZ3NxeGcxWWxMY3VIMg';
      const url = lineSdk.make_auth_url(
        state,
        uid,
        zcode,
        country,
        {
          hour,
          minute,
        },
        userTimeZone
      );
      res.send(url);
    } catch (err) {
      res.send(err);
    }
  }
);

router.get('/notify/cancel/:uid', (req, res) => {
  try {
    const userId = req.params.uid;
    const result = cancelScheduler(userId);
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

router.get('/callback', (req, res) => {
  var currentPage = `${'http://localhost:8080/'}notification`;

  if (req.query.error !== undefined && req.query.error === 'access_denied') {
    res.status(401).redirect(currentPage);
    return;
  }

  const code = req.query.code;
  const stateParam = req.query.state.split('.');
  const state = stateParam[0];

  const uid = Buffer.from(`${stateParam[1]}`, 'base64').toString('ascii');

  const zcode = parseInt(
    Buffer.from(`${stateParam[2]}`, 'base64').toString('ascii')
  );

  const country = Buffer.from(`${stateParam[3]}`, 'base64').toString('ascii');

  const hour = parseInt(
    Buffer.from(`${stateParam[4]}`, 'base64').toString('ascii')
  );

  const minute = parseInt(
    Buffer.from(`${stateParam[5]}`, 'base64').toString('ascii')
  );

  const userTimeZone = Buffer.from(`${stateParam[6]}`, 'base64').toString(
    'ascii'
  );
  if (!code) {
    console.log('Authorization failed.');
    res.status(401).redirect(currentPage);
    return;
  }

  if (!secure_compare(state, 'bm90aWZ5U3RhdGUxMjM=QUl2Y2RTd0VhMWhLb0NWZ3NxeGcxWWxMY3VIMg')) {
    console.log('Authorization failed. State does not match.');
    res.status(401).redirect(currentPage);
    return;
  }

  lineSdk
    .issue_access_token(code)
    .then(async (response) => {
      const accessToken = response.access_token;

      // here
      scheduler(
        uid,
        lineSdk,
        zcode,
        country,
        accessToken,
        { hour, minute },
        userTimeZone
      );
      const token = md5(`success${accessToken}`);
      res.redirect(currentPage + `?token=${token}`);
    })
    .catch(() => {
      res.status(400).redirect(currentPage);
    });
});

module.exports = router;
