import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./reducers/blogReducer";
import userReducer from "./reducers/userReducer";
import { BrowserRouter as Router } from "react-router-dom";

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    users: userReducer,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
