import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLogged, setIsLogged] = useState(false);

  if (isLogged) {
    return <Navigate replace to="/" />;
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin({ username, password }).then((res) => {
            if (res === "success") {
              setIsLogged(true);
            }
          });
        }}
      >
        <div>
          username
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button id="login-btn" type="submit">
          log in
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
