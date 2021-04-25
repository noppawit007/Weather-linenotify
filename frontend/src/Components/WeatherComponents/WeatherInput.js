import React, { useState, useEffect } from "react";
import { withFirebase } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import * as action from "../store/actionCreator";
import { lineAuth, cancelJob } from "../../API_Caller/apiService";
import { Dropdown } from "semantic-ui-react";
import Modal from "../ModalComponent/Modal";
import Loading from "../LoadingComponent/Loading";
import SmLoading from "../LoadingComponent/smLoading";
import moment from "moment-timezone";

/**
 *
 * @param {string} query
 */
const createAPIUrl = query =>
  `https://api.openweathermap.org/data/2.5/weather?zip=${query.searchQuery},${query.checkedItem}&appid=${"78e81a9a7425b24350cdb14a615c1edf"}`;

/**
 *
 * @param {none}
 */
const createAPIUrlSG = () =>
  `https://api.openweathermap.org/data/2.5/weather?q=Singapore,sg&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`;

/**
 *
 * @param {string} zipCode
 */
const zipRegx = /[0-9]{5}/;
const validateZipCode = zipCode => zipRegx.test(zipCode);

/**
 *
 * @param {number} temp
 */
const convertToFarenheit = temp =>
  ((temp - 273.15) * (9.0 / 5.0) + 32).toFixed(0);

/**
 *
 * @param {number} temp
 */
const convertToCelsius = temp => (temp - 273.15).toFixed(0);

function WeatherInput({
  setWeatherData,
  weatherStatus,
  forNotify,
  userId,
  firebase
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");

  // Data user set
  const [sendNotifyConfig, setSendNotifyConfig] = useState(true);

  // validation for zipcode
  const [isValidZipCode, setIsValidZipCode] = useState(true);
  const [didFoundZipCode, setdidFoundZipCode] = useState(true);

  // For result from api calls
  const [resForCancel, setResForCancel] = useState("");
  const [error, setError] = useState("");

  // Loading indicator
  const [isLoading, setIsLoading] = useState(false);
  const [isSmLoading, setIsSmLoading] = useState(false);

  // state for a country user choose
  const [isSG, setIsSG] = useState(false);
  const [checkedItem, setCheckedItem] = useState("us");

  // User config for weather notification
  const [saveConfig, setSaveConfig] = useState("");
  const [userConfig, setUserConfig] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [isSubmit, setIsSubmit] = useState(true);

  const dispatch = useDispatch();
  const weatherConfig = useSelector(({ appState }) => appState.weatherConfig);

  // Fetch user weather config
  useEffect(() => {
    setUserConfig(weatherConfig);
  }, [weatherConfig]);

  // When user type zipcode
  function updateSearchQuery({ target: { value } }) {
    setSearchQuery(value);
    setIsValidZipCode(validateZipCode(value) || value === "");
    setdidFoundZipCode(true);
  }

  // When user choose country
  function handleCheckbox({ target: { name } }) {
    setCheckedItem(name);
    if (name === "sg") {
      setIsSG(true);
      setIsValidZipCode(true);
      setSearchQuery("");
    } else {
      setIsSG(false);
    }
  }

  // Fetch weather info from api
  async function getWeatherData(funcFor) {
    setIsLoading(true);

    // when zipcode is empty
    if (searchQuery === "" && !isSG) {
      setIsLoading(false);
      setError("Please Input Zipcode");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    // when zipcode is invalid
    if (!isValidZipCode && !isSG) {
      setIsLoading(false);
      return;
    }

    // Fetching weather data
    let response = "";

    if (isSG) {
      // Fetching weather data for singapore
      response = await fetch(createAPIUrlSG());
    } else {
      response = await fetch(createAPIUrl({ searchQuery, checkedItem }));
    }

    // when zipcode doesn't match with any location
    if (!response.ok) {
      if (response.status === 404) {
        setdidFoundZipCode(response.ok);
      }
      setIsLoading(false);
      return;
    }

    const { main, weather, name } = await response.json();

    // For displaying weather info in browser.
    if (funcFor === "forDisplaying") {
      setWeatherData({
        tempF: convertToFarenheit(main.temp),
        tempC: convertToCelsius(main.temp),
        humidity: main.humidity,
        desc: weather[0].main,
        city: name
      });

      // This will update background color of page
      let status = weather[0].main;
      let drizzle = ["Drizzle", "Mist"];
      let smoke = ["Sand", "Haze", "Dust", "Fog", "Smoke", "Dust"];

      if (drizzle.includes(status)) {
        status = "Mist";
      }

      if (smoke.includes(status)) {
        status = "Sand";
      }

      // Change background image based on the weather
      weatherStatus("app-container " + status);
    }
    // For notification
    else {
      // When user haven't set time(hour)
      if (selectedHour === "") {
        setSelectedHour(false);
        setIsLoading(false);
        return;
      }
      // When user haven't set time(minute)
      if (selectedMinute === "") {
        setSelectedMinute(false);
        setIsLoading(false);
        return;
      }

      setModalTitle(
        `Do you want receive weather info at ${selectedHour}:${selectedMinute} for ${name}?`
      );

      const country =
        checkedItem === "us"
          ? "USA"
          : checkedItem === "de"
          ? "Germany"
          : checkedItem === "th"
          ? "Thailand"
          : "Singapore";

      // after user click ok on moda, this state will be stored in localstorage
      setSaveConfig({
        uid: userId,
        country: country,
        city: name,
        min: selectedMinute,
        hour: selectedHour
      });

      // for after user click ok on modal
      setSendNotifyConfig(true);
      handleOpenModal();
    }
    setIsLoading(false);
  }

  // After click submitbutton on Modal, it will be called
  function applyNotify() {
    setIsLoading(true);
    const uid = userId;
    const userTimeZone = moment.tz.guess();
    const secondParam = isSG ? 65 : searchQuery;

    // This is used to display user weather config
    localStorage.setItem("preWeatherConfig", JSON.stringify(saveConfig));

    // login to linenotify and set cron job
    lineAuth(
      uid,
      secondParam,
      checkedItem,
      { selectedHour, selectedMinute },
      userTimeZone
    )
      .then(res => {
        window.location.href = res;
      })
      .catch(err => {
        setIsLoading(false);
        setError("Someting went wrong.... Please try it again");
      });
  }

  // When user tap stop notification button
  function stopNotification() {
    setSendNotifyConfig(false);
    setIsSubmit(false);
    setModalTitle("Do you want to stop notification?");
    handleOpenModal();
  }

  // After user click ok button in modal, this will execute
  function applyStop() {
    setIsLoading(true);
    const uid = userId;

    // stop cron job and delete user weather config in firestore
    cancelJob(uid, firebase)
      .then(({ data }) => {
        if (data === "Success") {
          setResForCancel("Successfully stopped!");
          dispatch(action.removeWeatherConfig());
          setUserConfig("");
          firebase
            .getUserConfig(userId)
            .then()
            .catch(err => setResForCancel(err));
        } else {
          setResForCancel(data);
        }
        setIsLoading(false);
        setTimeout(() => {
          setResForCancel("");
        }, 3000);
        return;
      })
      .catch(err => {
        return;
      });
  }

  // Create list of hour for dropdown
  function getHour() {
    let timeListArray = [];

    for (var i = 0; i <= 23; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      timeListArray.push({
        key: `${i}`,
        text: `${i}`,
        value: `${i}`
      });
    }

    return timeListArray;
  }

  // Create list of minute for dropdown
  function getMinute() {
    let timeListArray = [];
    let list = ["00", "15", "30", "45"];

    for (var i = 0; i <= list.length - 1; i++) {
      timeListArray.push({
        key: `${list[i]}`,
        text: `${list[i]}`,
        value: `${list[i]}`
      });
    }
    return timeListArray;
  }

  const hourList = getHour();
  const minuteList = getMinute();

  // When user change time from dropdown
  function selectHour(event, { value }) {
    setSelectedHour(value);
  }

  function selectMinute(event, { value }) {
    setSelectedMinute(value);
  }

  // Modal functions
  function handleOpenModal() {
    return setShowModal(true);
  }

  function handleCloseModal() {
    setIsSubmit(true);
    return setShowModal(false);
  }

  function handleOk() {
    handleCloseModal();
    // identify if it's for notify or stop notify
    return sendNotifyConfig ? applyNotify() : applyStop();
  }

  return (
    <>
      <Modal
        showModal={showModal}
        closeModal={handleCloseModal}
        title={modalTitle}
        handleOk={handleOk}
        isSubmit={isSubmit}
      />

      <header className="weather-header">
        <h3 className="content-title">Weather Checker</h3>
        <div className="checkbox-box">
          <div>
            <label htmlFor="us">
              <p>USA</p>
              <input
                type="checkbox"
                id="us"
                name="us"
                onChange={handleCheckbox}
                checked={checkedItem === "us"}
              />
              <span></span>
            </label>
          </div>

          <div>
            <label htmlFor="de">
              <p>Germany</p>
              <input
                type="checkbox"
                id="de"
                name="de"
                onChange={handleCheckbox}
                checked={checkedItem === "de"}
              />
              <span></span>
            </label>
          </div>

          <div>
            <label htmlFor="th">
              <p>Thailand</p>
              <input
                type="checkbox"
                id="th"
                name="th"
                onChange={handleCheckbox}
                checked={checkedItem === "th"}
              />
              <span></span>
            </label>
          </div>

          <div>
            <label htmlFor="sg">
              <p>Singapore</p>
              <input
                type="checkbox"
                id="sg"
                name="sg"
                onChange={handleCheckbox}
                checked={checkedItem === "sg"}
              />
              <span></span>
            </label>
          </div>
        </div>
        {forNotify ? (
          <p>Now let's configure your notification!</p>
        ) : (
          <p>Input zipcode to check weather info</p>
        )}
        {isSG ? (
          <p>
            API supports only one location for singapore.{" "}
            {forNotify
              ? "You can just set time to be notified :)."
              : "Please click search icon to see weather."}
          </p>
        ) : (
          ""
        )}
        <div className="input-zipcode-box">
          <input
            placeholder={isSG ? "Singapore" : "Zip Code"}
            className="search-input"
            onChange={updateSearchQuery}
            maxLength="5"
            value={searchQuery}
            disabled={isSG}
          />

          {forNotify ? (
            ""
          ) : (
            <button
              className="material-icons"
              onClick={() => getWeatherData("forDisplaying")}
              type="button"
            >
              search
            </button>
          )}
        </div>
        <p className="error">{isValidZipCode ? "" : "Invalid Zip Code"}</p>
        <p className="error">{didFoundZipCode ? "" : "Cannot find Zip Code"}</p>
        <p className="error">{error ? error : ""}</p>
      </header>
      {forNotify ? (
        <div className="notify-container">
          <p>Time to send notification</p>
          <div className="dropdown-box">
            <Dropdown
              placeholder="Hour"
              selection
              onChange={selectHour}
              options={hourList}
              className="dropdown-time"
            />

            <Dropdown
              placeholder="Minute"
              selection
              onChange={selectMinute}
              options={minuteList}
              className="dropdown-time"
            />
          </div>

          <p className="error">
            {selectedHour === false || selectedMinute === false
              ? "Please select time for notifying"
              : ""}
          </p>

          <div className="notification-button-container">
            <button
              className="btnMine notifyBtn"
              onClick={() => getWeatherData("forNotify")}
            >
              Connect with LineNotify
            </button>

            <div>{isSmLoading ? <SmLoading /> : ""}</div>

            {userConfig ? (
              <>
                <div>
                  <p>Your current notification setting</p>
                  <p>
                    <span>{userConfig.country}</span> {userConfig.hour} :{" "}
                    {userConfig.min}
                  </p>
                </div>

                <button className="btnMine stopBtn" onClick={stopNotification}>
                  Stop receiving notification
                </button>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="success-width">
        <p
          className={
            resForCancel === "Successfully stopped!" ? "success" : "error"
          }
        >
          {resForCancel}
        </p>
      </div>
      {isLoading ? <Loading isLoading={isLoading} /> : ""}
    </>
  );
}

export default withFirebase(WeatherInput);
