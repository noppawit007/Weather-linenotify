import React, { useState, useEffect } from "react";
import { withFirebase } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import * as action from "../store/actionCreator";
import { parse } from "query-string";
import WeatherInput from "../WeatherComponents/WeatherInput";
import SignOutButton from "../ButtonComponents/SignOutButton";
import HomeButton from "../ButtonComponents/HomeButton";
import Modal from "../ModalComponent/Modal";
import Loading from "../LoadingComponent/Loading";

function NotificationPage(props) {
  const { history, location, firebase } = props;

  // For a the loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // displaying modal
  const [showModal, setShowModal] = useState(false);

  // For a status of api response
  const [success, setSuccess] = useState(false);
  const params = parse(location.search);
  const successQuery = params.query;
  const token = params.token;

  const dispatch = useDispatch();
  const userId = useSelector(({ appState }) => appState.userId);

  // Fetch user weather config
  useEffect(() => {
    firebase
      .getUserConfig(userId)
      .then(data => {
        dispatch(action.setWeatherConfig(data));
      })
      .catch(err => {
        console.log(err);
      });
  }, [userId]);

  useEffect(() => {
    // Listen user status
    firebase.auth.onAuthStateChanged(authUser => {
      if (!!authUser === false) {
        return history.push("/auth");
      }
    });
  }, []);

  useEffect(() => {
    // When user signed up
    if (successQuery) {
      setSuccess("Successfully registered!");
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      history.push("/notification");
    }

    // When user successfully configured notification.
    if (token) {
      var { uid, country, city, min, hour } = JSON.parse(
        localStorage.getItem("preWeatherConfig")
      );
      dispatch(
        action.setWeatherConfig({
          uid: uid,
          country: country,
          city: city,
          min: min,
          hour: hour
        })
      );
      firebase.saveUserConfig(uid, { country, min, hour });
      setSuccess("Congrats! You will receive daily weather info everyday!");
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      history.push("/notification");
    }
  }, [token, successQuery, firebase, history]);

  // when user open modal to sign out
  function clickSignOut() {
    return setShowModal(true);
  }

  // Excute sign out after user click signout button
  function handleOk() {
    setIsLoading(true);
    firebase.doSignOut();
    dispatch(action.signOut());
    setIsLoading(false);
  }

  // When user clcik cancel or clocse button on modal
  function handleCloseModal() {
    return setShowModal(false);
  }

  return (
    <>
      <Modal
        showModal={showModal}
        closeModal={handleCloseModal}
        title={"Do you want to Sign out?"}
        handleOk={handleOk}
        isSubmit={false}
      />
      <section className="weather-container notification-container">
        <header className="notification-header">
          {success ? <p className="success">{success}</p> : ""}
        </header>
        <section>
          <WeatherInput forNotify={true} userId={userId} />
        </section>
        <section className="notification-redirect-button">
          <HomeButton props={props} />
          <SignOutButton clickSignOut={clickSignOut} />
        </section>
      </section>
      {isLoading ? <Loading isLoading={isLoading} /> : ""}
    </>
  );
}

export default withFirebase(NotificationPage);
