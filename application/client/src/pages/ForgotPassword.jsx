/**
 * ForgotPassword.jsx
 * ------------------
 * A placeholder page for the password reset flow. Currently shows a message
 * directing users to contact support.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-5 text-center">
              <h2 className="card-title mb-4">Forgot Password?</h2>
              <p className="text-muted mb-4">
                Password reset feature coming soon.
              </p>
              <Link to="/login" className="btn btn-primary">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

