import * as types from "./actionTypes";

// Authentication
export function signIn() {
  return {
    type: types.AUTH_SIGNIN_SUCCEEDED
  };
}

export function setUserId(userId) {
  return {
    type: types.AUTH_SET_USER_ID,
    payload: userId
  };
}

export function failSignIn(error) {
  return {
    type: types.AUTH_SIGNIN_FAILED,
    payload: error
  };
}

export function signOut() {
  return {
    type: types.AUTH_SIGNOUT
  };
}

// Weather Configuration
export function setWeatherConfig(config) {
  return {
    type: types.WEATHER_SET_CONFIG,
    payload: config
  };
}

export function removeWeatherConfig() {
  return {
    type: types.WEATHER_REMOVE_CONFIG
  };
}
