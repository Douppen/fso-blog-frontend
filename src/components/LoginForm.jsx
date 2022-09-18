import React, { useState } from "react";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h2>Log in to application</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin({ username, password }).then((status) => {
            if (status === "success") {
              setUsername("");
              setPassword("");
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
