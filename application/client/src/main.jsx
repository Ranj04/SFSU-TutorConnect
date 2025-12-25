/**
 * main.jsx
 * --------
 * The entry point for the React application. This file bootstraps the app
 * by rendering the root App component into the DOM.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import './index.css';
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* StrictMode helps surface lifecycle issues while we build new features */}
    <App />
  </React.StrictMode>
);
