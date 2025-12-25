/**
 * QAHelper.jsx
 * ------------
 * A development-only page with quick links for testing different user flows.
 * Not accessible in production builds.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function QAHelper() {
  const navigate = useNavigate();
  
  // Only show in dev mode
  if (!import.meta.env.DEV) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          QA Helper is only available in development mode.
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="mb-4">QA Helper - Quick Test Links</h2>
          
          <div className="mb-4">
            <h4>Environment Info</h4>
            <ul className="list-unstyled">
              <li><strong>Build Date:</strong> {new Date().toISOString()}</li>
              <li><strong>Mode:</strong> {import.meta.env.MODE}</li>
              <li><strong>API Base:</strong> {import.meta.env.VITE_API_BASE_URL || '/api'}</li>
              <li><strong>Backend Enabled:</strong> {import.meta.env.VITE_API_BASE_URL ? 'Yes' : 'No (using fallback)'}</li>
            </ul>
          </div>
          
          <hr />
          
          <div className="mb-4">
            <h4>Main Flows</h4>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <Link to="/" className="btn btn-outline-primary">Home</Link>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/search?q=CSC 648&category=computer-science')}
              >
                Search: Valid Query (CSC 648)
              </button>
              <button 
                className="btn btn-warning"
                onClick={() => navigate('/search?q=test@#$%invalid&category=computer-science')}
              >
                Search: Invalid Query (shows validation)
              </button>
              <Link to="/search?q=" className="btn btn-outline-primary">Search: Empty</Link>
              <Link to="/postings/1" className="btn btn-outline-primary">Posting Detail (ID: 1)</Link>
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate('/contact-tutor?postingId=1&postingTitle=CSC 648 Tutor')}
              >
                Contact Tutor (ID: 1)
              </button>
              <Link to="/dashboard" className="btn btn-outline-primary">Dashboard</Link>
              <Link to="/login" className="btn btn-outline-secondary">Login</Link>
              <Link to="/register" className="btn btn-outline-secondary">Register</Link>
            </div>
          </div>
          
          <div className="mb-4">
            <h5>Test Scenarios</h5>
            <ol>
              <li>
                <strong>Search Validation:</strong> Try searching with special characters (e.g., "test@#$") 
                - should show validation error
              </li>
              <li>
                <strong>Approved Postings Only:</strong> Search should only show approved postings
              </li>
              <li>
                <strong>Contact Flow:</strong> Navigate to posting detail → Contact Tutor → Submit form → Check Dashboard messages
              </li>
              <li>
                <strong>Registration:</strong> Try registering without @sfsu.edu email or without Terms checkbox
              </li>
              <li>
                <strong>Clean Browser:</strong> Open in incognito/private window - seed data should load automatically
              </li>
            </ol>
          </div>
          
          <div className="alert alert-info">
            <strong>Note:</strong> This page is only visible in development mode (localhost).
            It will not appear in production builds.
          </div>
        </div>
      </div>
    </div>
  );
}

