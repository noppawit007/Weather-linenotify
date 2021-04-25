import React from 'react';

const HomeButton = ({ props }) => (
  <button
    type="button"
    className="btnMine signout-btn"
    onClick={() => props.history.push('/')}
  >
    Home
  </button>
);

export default HomeButton;
