/**
 * ProtectedRoute.jsx
 * ------------------
 * A wrapper component that protects routes requiring authentication.
 * If a user isn't logged in, they get redirected to the login page with
 * the original destination saved so they can be sent back after signing in.
 *
 * Note: client-side route guarding is UX only — the backend enforces auth on
 * every protected endpoint. The auth helper functions live in ../utils/auth so
 * this file exports only a component (react-refresh/only-export-components).
 *
 * Important: Users aren't locked into roles here. Everyone starts as a student
 * and can also become a tutor. Tutors still have all student features—they
 * just get extra capabilities like creating postings and receiving messages.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

/**
 * ProtectedRoute wrapper component.
 * Redirects unauthenticated users to the login page.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login with the intended destination preserved.
    const redirectPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
  }

  return children;
}
