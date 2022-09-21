import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLogged, setIsLogged] = useState(false);

  if (isLogged) {
    return <Navigate replace to="/" />;
  }

  return (
    <div className="rounded-xl bg-beige p-8 flex flex-col items-center space-y-4">
      <h1 className="text-xl sm:text-3xl font-bold">
        This is a blog sharing app
      </h1>
      <h2 className="font-medium text-lg sm:text-xl text-brown">
        Log in below
      </h2>
      <form
        className="flex flex-col space-y-4"
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
          <p>username</p>
          <input
            className=""
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <p>password</p>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="bg-cream rounded-xl p-2"
          id="login-btn"
          type="submit"
        >
          log in
        </button>
        <button>
          <Link to="/register">
            <p>need to register?</p>
          </Link>
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
