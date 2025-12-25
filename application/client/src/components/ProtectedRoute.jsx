/**
 * ProtectedRoute.jsx
 * ------------------
 * A wrapper component that protects routes requiring authentication.
 * If a user isn't logged in, they get redirected to the login page with
 * the original destination saved so they can be sent back after signing in.
 * 
 * Important: Users aren't locked into roles here. Everyone starts as a student
 * and can also become a tutor. Tutors still have all student features—they
 * just get extra capabilities like creating postings and receiving messages.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is logged in
 */
export function isAuthenticated() {
  const user = localStorage.getItem("user");
  const isAuth = localStorage.getItem("isAuthenticated");
  return !!(user && isAuth === "true");
}

/**
 * Get current user from localStorage
 * @returns {object|null} - User object or null
 */
export function getCurrentUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

/**
 * Check if current user has tutor capability (not a role lock!)
 * Users can be BOTH students AND tutors - this just checks if they
 * have the additional tutor features enabled.
 * @returns {boolean} - True if user has tutor capability
 */
export function hasTutorCapability() {
  const user = getCurrentUser();
  return user?.is_tutor === true || user?.isTutor === true;
}

// Alias for backwards compatibility
export const isTutor = hasTutorCapability;

/**
 * Check if current user's tutor profile is approved by admin
 * This enables tutor-specific features like creating postings
 * and receiving messages from students.
 * @returns {boolean} - True if tutor profile is approved
 */
export function isTutorApproved() {
  const user = getCurrentUser();
  return (user?.is_tutor === true || user?.isTutor === true) && 
         (user?.tutor_status === 'approved' || user?.tutorStatus === 'approved');
}

/**
 * ProtectedRoute wrapper component
 * Redirects unauthenticated users to login page
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login with the intended destination
    const redirectPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
  }

  return children;
}

/**
 * RequireAuth hook for programmatic auth checks
 * Returns redirect path if not authenticated
 */
export function useRequireAuth() {
  const location = useLocation();
  
  const checkAuth = () => {
    if (!isAuthenticated()) {
      const redirectPath = encodeURIComponent(location.pathname + location.search);
      return `/login?redirect=${redirectPath}`;
    }
    return null;
  };

  return {
    isAuthenticated: isAuthenticated(),
    user: getCurrentUser(),
    isTutor: isTutor(),
    isTutorApproved: isTutorApproved(),
    getLoginRedirect: checkAuth,
  };
}

