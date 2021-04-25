const request = require('request');
let Promise = require('bluebird');
Promise.promisifyAll(request);

/**
@class
*/
class LineLogin {
  /**
        @constructor
        @param {Object} options
        @param {String} options.channel_id - LINE Channel Id
        @param {String} options.channel_secret - LINE Channel secret
        @param {String} options.callback_url - LINE Callback URL
        // @param {String} [options.scope="profile openid"] - Permission to ask user to approve. Supported values are "profile", "openid" and "email". To specify email, you need to request approval to LINE.
        @param {String} [options.scope="notify"] - Permission to ask user to approve. Supported values are "profile", "openid" and "email". To specify email, you need to request approval to LINE.
    */
  constructor(options) {
    const required_params = ['channel_id', 'channel_secret', 'callback_url'];
    const optional_params = ['scope'];

    // Check if required parameters are all set.
    required_params.map((param) => {
      if (!options[param]) {
        throw new Error(`Required parameter ${param} is missing.`);
      }
      return param;
    });

    // Check if configured parameters are all valid.
    Object.keys(options).map((param) => {
      if (
        !required_params.includes(param) &&
        !optional_params.includes(param)
      ) {
        throw new Error(`${param} is not a valid parameter.`);
      }
      return param;
    });

    this.channel_id = options.channel_id;
    this.channel_secret = options.channel_secret;
    this.callback_url = options.callback_url;
    this.scope = options.scope || 'notify';
  }

  /**
    Method to make authorization URL
    @method
    @return {String}
    */
  make_auth_url(state, uid, zipcode, country, { hour, minute }, userTimeZone) {
    const client_id = encodeURIComponent(this.channel_id);
    const redirect_uri = encodeURIComponent(this.callback_url);
    const scope = encodeURIComponent(this.scope);
    // To attach uid into url
    state = `${state}.${uid}.${zipcode}.${country}.${hour}.${minute}.${userTimeZone}`;
    let url = `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`;
    return url;
  }

  /**
    Method to retrieve access token using authorization code.
    @method
    @param {String} code - Authorization code
    @return {Object}
    */
  issue_access_token(code) {
    const url = `https://notify-bot.line.me/oauth/token`;

    const form = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.callback_url,
      client_id: this.channel_id,
      client_secret: this.channel_secret,
    };
    return request
      .postAsync({
        url: url,
        form: form,
      })
      .then((response) => {
        if (response.statusCode === 200) {
          return JSON.parse(response.body);
        } else {
          return response.statusCode;
        }
      });
  }

  /**
    Method to notify a content.
    @method
    @param {String} access_token - Access token
    @param {String} content - content to send
    @return {Object}
    */
  notify_contents(access_token, content) {
    const url = `https://notify-api.line.me/api/notify`;
    const header = {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const form = {
      message: content,
    };
    return request
      .postAsync({
        url: url,
        headers: header,
        form: form,
      })
      .then((response) => {
        if (response.statusCode === 200) {
          return JSON.parse(response.body);
        } else {
          return response.statusCode;
        }
      });
  }

  /**
    Method to verify the access token.
    @method
    @param {String} access_token - Access token
    @return {Object}
    */
  verify_access_token(access_token) {
    const url = `https://notify-api.line.me/api/status`;
    const header = {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    return request
      .getAsync({
        url: url,
        headers: header,
      })
      .then((response) => {
        if (response.statusCode === 200) {
          return JSON.parse(response.body);
        } else {
          return response.statusCode;
        }
      });
  }

  /**
    Method to invalidate the access token.
    @method
    @param {String} access_token - Access token.
    @return {statusCode}
    */
  revoke_access_token(access_token) {
    const url = `https://notify-api.line.me/api/revoke`;
    const header = {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    return request
      .postAsync({
        url: url,
        headers: header,
      })
      .then((response) => {
        if (response.statusCode === 200) {
          return JSON.parse(response.body);
        } else {
          return response.statusCode;
        }
      });
  }
}

module.exports = LineLogin;
