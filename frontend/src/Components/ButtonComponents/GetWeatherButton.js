import React from 'react';
import { withFirebase } from '../../config';

function GetWeatherButton({ props, firebase }) {
  // Check user status. If user is not logged in, redirect to authentication page
  function checkAuth() {
    firebase.auth.onAuthStateChanged(authUser => {
      if (!!authUser) {
        return props.history.push('/notification');
      } else {
        return props.history.push('/auth');
      }
    });
  }

  return (
    <button className="btnMine notifyBtn" type="button" onClick={checkAuth}>
      Get daily weather
    </button>
  );
}

export default withFirebase(GetWeatherButton);
