import React from 'react';

function AuthForm({
  submitForm,
  isLogin,
  registerForm,
  updateForm,
  userInput,
  isValidEmail,
  isValidPassword,
  error,
  forgetPassword,
  isShowPass,
  changeShowPass,
  changePasshide
}) {
  return (
    <div className="auth-section">
      <form onSubmit={submitForm} className="auth-form">
        <h3 className="test">{isLogin ? 'Login Form' : 'Sign up Form'}</h3>

        <p>
          {isLogin
            ? 'Please login to configure weather notification.'
            : 'Please enter user name you prefer.'}
        </p>
        <p className="register-content">
          {isLogin
            ? "You haven't register yet? Please click button to register. "
            : ''}
          {isLogin ? (
            <button
              type="button"
              onClick={registerForm}
              name="registerButton"
              className="btnMine register-btn"
            >
              Register
            </button>
          ) : (
            ''
          )}
        </p>
        <div className="input-form">
          <label className="input-label">Email address</label>
          <input
            type="email"
            name="email"
            onChange={updateForm}
            value={userInput.email}
            className="input-email"
            placeholder="smaple@sample.com"
          />
        </div>

        <p className="error">
          {isValidEmail
            ? ''
            : 'Invalid email address. Check if @ and domain name are included.'}
        </p>

        <div className="input-form">
          <label className="input-label">Password</label>
          <div className="password-box">
            <input
              type={isShowPass ? 'text' : 'password'}
              name={isShowPass ? 'text' : 'password'}
              onChange={updateForm}
              value={userInput.password}
              className="input-password"
              placeholder="password"
              onKeyDown={changePasshide}
            />
            {userInput.password === '' ? (
              ''
            ) : (
              <button
                className="material-icons password-visible"
                onClick={changeShowPass}
                type="button"
              >
                {isShowPass ? 'visibility_off' : 'visibility'}
              </button>
            )}
          </div>
        </div>

        <p className="error">
          {isValidPassword
            ? ''
            : 'Invalid password. Uppsercase first letter & alphanumeric & longer than or equals 6 chars'}
        </p>

        <div className="auth-submit">
          <p className="error">{error ? error : ''}</p>
          <input type="submit" value="Submit" className="btnMine notifyBtn" />
        </div>
      </form>
      <section>
        {isLogin ? (
          <button
            type="button"
            onClick={forgetPassword}
            name="forgetPasswordButton"
            className="btnMine signout-btn"
          >
            Did you forget password?
          </button>
        ) : (
          ''
        )}
      </section>
    </div>
  );
}

export default AuthForm;
