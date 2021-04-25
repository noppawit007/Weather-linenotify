import React from 'react';

const SignOutButton = ({ clickSignOut }) => (
  <button className="btnMine signout-btn" type="button" onClick={clickSignOut}>
    Sign Out
  </button>
);

export default SignOutButton;
