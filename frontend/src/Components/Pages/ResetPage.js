import React, { useState } from "react";
import { withFirebase } from "../../config";
import { useDispatch } from "react-redux";
import * as action from "../store/actionCreator";
import HomeButton from "../ButtonComponents/HomeButton";
import Loading from "../LoadingComponent/Loading";

function ResetPage(props) {
  const { firebase } = props;

  const [email, setEmail] = useState("");

  // When api call to firebase was successfully excuted
  const [success, setSuccess] = useState("");

  // When error occured for api call to firebase
  const [error, setError] = useState("");

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  // Onchange input
  function updateForm({ target: { value } }) {
    setEmail(value);
  }

  // Send submit form(email address)
  function submitForm(event) {
    event.preventDefault();
    if (email === "") {
      setError("Please input your email address");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    } else {
      setIsLoading(true);
      firebase
        .doPasswordReset(email)
        .then(res => {
          setIsLoading(false);
          setSuccess("Successfully sent reset email to your email address.");
        })
        .catch(err => {
          setIsLoading(false);
          dispatch(action.failSignIn(err.message));
          setError(err.message);
        });
      setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
    }
  }

  return (
    <>
      <section className="weather-container reset-container">
        <header className="reset-header">
          <h3>Reset password</h3>
          <p>Input email address to update your password</p>
        </header>

        <form onSubmit={submitForm} className="reset-form">
          <input
            type="email"
            name="email"
            value={email}
            onChange={updateForm}
            placeholder="Email Address"
            className="email-input"
          />
          <button type="submit" className="btnMine reset-btn">
            Reset Password
          </button>
        </form>
        <div className="reset-response">
          {error ? <p className="error">{error}</p> : ""}
          {success ? <p className="success">{success}</p> : ""}
        </div>
        <div className="reset-home-btn">
          <HomeButton props={props} />
        </div>
      </section>
      {isLoading ? <Loading isLoading={isLoading} /> : ""}
    </>
  );
}

export default withFirebase(ResetPage);
