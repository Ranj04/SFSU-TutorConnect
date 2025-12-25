/**
 * TermsOfService.jsx
 * ------------------
 * Displays the terms of service that users must agree to when registering.
 * This is a static page with the legal text for using the platform.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React from "react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Terms of Service</h1>
          
          {/* Lead disclaimer card makes it crystal clear we're a class project */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Disclaimer</h5>
              <p className="text-muted mb-3">
                <strong>TutorConnect is not an official San Francisco State University (SFSU) website or service.</strong> This platform is an independent project created by students for educational purposes as part of CSC 648.
              </p>
              <p className="text-muted mb-0">
                <strong>Liability Disclaimer:</strong> TutorConnect and its creators are exempt from all liability arising from the use of this site. Users acknowledge that they use this platform at their own risk and agree to hold TutorConnect, its developers, and SFSU harmless from any claims, damages, or losses resulting from their use of this service.
              </p>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <p className="text-muted">
                Additional terms of service content will be added here.
              </p>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left"></i> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

