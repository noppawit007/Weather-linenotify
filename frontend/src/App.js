import React, { useState, useEffect } from "react";
import { useDispatch, Provider } from "react-redux";
import * as action from "./Components/store/actionCreator";
import Store from "./redux/store";
import { BrowserRouter, Route, useLocation } from "react-router-dom";
import { withFirebase } from "./config";
import {
  WeatherPage,
  AuthPage,
  ResetPage,
  NotificationPage
} from "./Components/Pages";

function App(props) {
  
  const [weatherStatus, setWeatherStatus] = useState("app-container Clear");
  const { firebase } = props;

  const ScrollToTop = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
      firebase.auth.onAuthStateChanged(authUser => {
        if (!!authUser) {
          dispatch(action.signIn());
          dispatch(action.setUserId(authUser.uid));
        }
      });
    }, [pathname]);

    return null;
  };

  const Layout = ({ children }) => {
    return (
      <section className={weatherStatus}>
        <div className="color-filter">
          <ScrollToTop />
          {children}
        </div>
      </section>
    );
  };

  return (
    <Provider store={Store}>
      <BrowserRouter basename="/weather-demo">
        <Layout>
          <Route
            exact
            path="/"
            render={props => (
              <WeatherPage {...props} weatherStatus={setWeatherStatus} />
            )}
          />
          <Route exact path="/auth" component={AuthPage} />
          <Route exact path="/reset/password" component={ResetPage} />
          <Route exact path="/notification" component={NotificationPage} />
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default withFirebase(App);
