/**
 * SFSUEmailHint.jsx
 * -----------------
 * A small helper that shows a green checkmark when the user enters a valid
 * @sfsu.edu email address. Used on the login and registration forms.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React from "react";

export default function SFSUEmailHint({ email, hasError = false }) {
  if (!email || hasError) return null;
  
  // Happy-path: cheer on students who remember to use their campus email
  if (email.trim().toLowerCase().endsWith("@sfsu.edu")) {
    return (
      <small className="form-text text-success">
        <i className="bi bi-check-circle" aria-hidden="true"></i>{" "}
        <span>SFSU email verified. Verification badge coming soon!</span>
      </small>
    );
  }
  
  return null;
}

