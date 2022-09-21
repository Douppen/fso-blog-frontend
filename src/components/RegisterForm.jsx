import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import userService from "../services/users";

const RegisterForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = ({ username, password }) => {
    userService()
      .create({ username, password, name })
      .then(() => {
        handleLogin({ username, password }).then(() => {
          setIsRegistered(true);
        });
      })
      .catch((error) => {
        const message = error.response.data.error;
        console.log(message);
        if (message === "username must be unique") {
          toast.error("that username already exists");
        } else if (message === "name is required") {
          toast.error("name is required");
        } else if (message === "username must be at least 3 characters long") {
          toast.error("username must be at least 3 characters");
        } else if (message === "password must be at least 3 characters long") {
          toast.error("password must be at least 3 characters");
        }
      });
  };

  if (isRegistered) {
    return <Navigate replace to="/" />;
  }

  return (
    <div className="rounded-xl bg-beige p-8 flex flex-col items-center space-y-4">
      <h2 className="font-bold text-xl text-brown">Register an account</h2>
      <form
        className="flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister({ username, password });
        }}
      >
        <div>
          <p>name</p>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
          register
        </button>
        <button>
          <Link to="/login">
            <p>already have an account?</p>
          </Link>
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
