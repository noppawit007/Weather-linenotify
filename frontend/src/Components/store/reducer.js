import * as types from "./actionTypes";

const INITIAL_STATE = {
  isAuthenticated: false,
  error: null,
  userId: null,
  weatherConfig: null
};

function reducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;

  switch (type) {
    case types.AUTH_SIGNIN_SUCCEEDED:
      return {
        ...state,
        isAuthenticated: true,
        isFetching: false
      };
    case types.AUTH_SET_USER_ID:
      return {
        ...state,
        userId: payload
      };
    case types.AUTH_SIGNIN_FAILED:
      return {
        ...state,
        error: payload
      };
    case types.AUTH_SIGNOUT:
      return INITIAL_STATE;
    case types.WEATHER_SET_CONFIG:
      return {
        ...state,
        weatherConfig: payload
      };
    case types.WEATHER_REMOVE_CONFIG:
      return {
        ...state,
        weatherConfig: null
      };
    default:
      return state;
  }
}

export default reducer;
