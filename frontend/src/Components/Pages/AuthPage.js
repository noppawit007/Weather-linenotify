import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as action from "../store/actionCreator";
import { withFirebase } from "../../config";
import Auth from "../../auth/auth";
import Modal from "../ModalComponent/Modal";
import AuthForm from "../AuthComponents/AuthForm";
import HomeButton from "../ButtonComponents/HomeButton";
import Loading from "../LoadingComponent/Loading";

/**
 * validate email
 * @param {string & int} email
 */
const emailRegx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const emailValidation = email => emailRegx.test(email);

/**
 * validate password
 * @param {string & int} password
 */
const upperRegx = /^[A-Z]/;
const intRegx = /\d/;
const unexpectRegx = /[^0-9a-zA-Z]/;
const passwordValidation = password =>
  upperRegx.test(password) &&
  intRegx.test(password) &&
  !unexpectRegx.test(password) &&
  password.length > 5;

function AuthPage(props) {
  const { history } = props;

  const [userInput, setInput] = useState({
    email: "",
    password: ""
  });

  // If this form is for login or register
  const [isLogin, setIsLogin] = useState(true);

  // Validation for Email and Password
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setValidPassword] = useState(true);

  // Show and hide password
  const [isShowPass, setIsShowPass] = useState(false);

  // Error from api response
  const [error, setError] = useState("");

  // loading status
  const [isLoading, setIsLoading] = useState(false);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [isSubmit, setIsSubmit] = useState(true);

  const isAuthenticated = useSelector(
    ({ appState }) => appState.isAuthenticated
  );

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);

    if (!!isAuthenticated) {
      history.push("/notification");
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  // Validate user input and set state.
  function updateForm({ target: { value, name } }) {
    if (!isLogin && name === "email") {
      setIsValidEmail(emailValidation(value) || value === "");
    } else if (!isLogin && name === "password") {
      setValidPassword(passwordValidation(value) || value === "");
    }
    setInput({ ...userInput, [name]: value });
  }

  // When click submit button
  function submitForm(event) {
    event.preventDefault();
    if (!!userInput.email && !!userInput.password) {
      if (isLogin) {
        return sendSignIn();
      }
      if (isValidEmail && isValidPassword) {
        setModalTitle("Do you want to submit?");
        return handleOpenModal();
      }
    } else {
      return createEmptyMessage();
    }
  }

  // For empty form
  function createEmptyMessage() {
    let errMes = "Please input ";

    if (!!userInput.email === false) {
      if (errMes.includes("User name")) {
        errMes += "& ";
      }
      errMes += "Email address ";
    }

    if (!!userInput.password === false) {
      if (errMes.includes("User name") || errMes.includes("Email address")) {
        errMes += "& ";
      }
      errMes += "Password ";
    }
    setError(errMes);
    setTimeout(() => {
      setError("");
    }, 2000);
    return;
  }

  // Send sign up info to api
  function sendSignUp() {
    setIsLoading(true);
    Auth.signUp(userInput, props)
      .then(() => {
        setIsLoading(false);
        props.history.push({
          pathname: "/notification",
          search: "?query=success",
          state: { detail: "SignedUp" }
        });
      })
      .catch(({ message }) => {
        dispatch(action.failSignIn(message));
        setError(message);
        setIsLoading(false);
        setTimeout(() => {
          setError("");
        }, 3000);
        return;
      });
  }

  // Sign in
  function sendSignIn() {
    setIsLoading(true);
    Auth.signIn(userInput, props)
      .then(authUser => {
        setIsLoading(false);
        props.history.push("/notification");
      })
      .catch(({ message }) => {
        dispatch(action.failSignIn(message));
        setError(message);
        setIsLoading(false);
        setTimeout(() => {
          setError("");
        }, 3000);
        return;
      });
  }

  // When user click register button
  function registerForm() {
    setInput({
      ...userInput,
      email: "",
      password: ""
    });
    setIsShowPass(false);
    return setIsLogin(false);
  }

  // When user click forget button
  function forgetPassword() {
    history.push("/reset/password");
  }

  // Modal handling
  function handleCloseModal() {
    setIsSubmit(true);
    return setShowModal(false);
  }

  function handleOpenModal() {
    return setShowModal(true);
  }

  // When user click submit button on modal
  function handleOk() {
    setIsLoading(true);
    handleCloseModal();
    return sendSignUp();
  }

  // Showing input password
  function changeShowPass() {
    setIsShowPass(!isShowPass);
  }

  function changePasshide() {
    if (isShowPass) {
      setIsShowPass(false);
    }
  }

  return (
    <section className="weather-container auth-container">
      {isLoading ? <Loading isLoading={isLoading} /> : ""}

      <Modal
        showModal={showModal}
        closeModal={handleCloseModal}
        title={modalTitle}
        handleOk={handleOk}
        isSubmit={isSubmit}
      />
      <AuthForm
        submitForm={submitForm}
        isLogin={isLogin}
        registerForm={registerForm}
        updateForm={updateForm}
        userInput={userInput}
        isValidEmail={isValidEmail}
        isValidPassword={isValidPassword}
        error={error}
        forgetPassword={forgetPassword}
        isShowPass={isShowPass}
        changeShowPass={changeShowPass}
        changePasshide={changePasshide}
      />

      <div className="auth-home-btn">
        <HomeButton props={props} />
      </div>
    </section>
  );
}
export default withFirebase(AuthPage);
