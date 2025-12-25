/**
 * BecomeTutor.jsx
 * ---------------
 * A landing page encouraging users to become tutors. Explains the benefits
 * and guides them to either sign up or create their first posting.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function BecomeTutor() {
  const navigate = useNavigate(); // quick shortcut for CTA that opens the posting wizard

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Become a Tutor</h1>
          <p className="text-muted mb-4">
            Share your expertise and help fellow SFSU students succeed. Create your tutor profile and start connecting with students today.
          </p>
          
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Get Started</h5>
              <p className="card-text">
                To become a tutor, you'll need to:
              </p>
              <ol>
                <li>Create an account or sign in</li>
                <li>Complete your tutor profile</li>
                <li>Create your first posting</li>
              </ol>
              <div className="d-flex gap-2 mt-4">
                <Link to="/register" className="btn btn-primary">
                  Create Account
                </Link>
                <Link to="/login" className="btn btn-outline-primary">
                  Sign In
                </Link>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/post")}
                >
                  Create Posting
                </button>
              </div>
            </div>
          </div>

          <Link to="/" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left"></i> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

