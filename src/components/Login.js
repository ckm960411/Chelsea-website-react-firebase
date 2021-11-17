import { useState } from "react";
import "styles/Login.scss";

function Login({ setIsLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
  };
  const onSwitchAccount = () => setNewAccount(prev => !prev)

  return (
    <div>
      <div className="auth__form-container">
        <div className="auth__container">
          <img
            src="../../images/chelsea-logo-300.png"
            alt="chelsea-logo"
            className="auth__logo"
            style={{ width: 100 }}
          />
          <h1 className="auth__header">
            {newAccount ? (
              <>
                Welcome! <br />
                Be join our Chelsea FC club
              </>
            ) : (
              <>Login your ID</>
            )}
          </h1>
          <form onSubmit={onSubmit} className="auth__form">
            <input
              name="email"
              type="text"
              placeholder="Your Email"
              required
              value={email}
              onChange={onChange}
              className="authInput"
            />
            <input
              name="password"
              type="password"
              placeholder="Your Password"
              required
              value={password}
              onChange={onChange}
              className="authInput"
            />
            <input
              type="submit"
              value={newAccount ? "Create New Account" : "Log in"}
              className="authInput authBtn"
            />
          </form>
          <button onClick={onSwitchAccount} className="auth__switchBtn">
            {newAccount ? "I already have my ID" : "Join us"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
