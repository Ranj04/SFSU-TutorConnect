/**
 * auth.js
 * -------
 * Client-side authentication helpers.
 *
 * IMPORTANT: these are UX conveniences only. They read the cached user object
 * and token from localStorage to decide what to render. They are NOT a security
 * boundary — the backend enforces auth on every protected endpoint via the
 * bearer token (see services/api.js and the FastAPI get_current_user dependency).
 * Never trust is_tutor / tutor_status from localStorage for authorization.
 *
 * (Extracted from ProtectedRoute.jsx so that component file only exports a
 * component, satisfying react-refresh/only-export-components.)
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */

/**
 * Check if a user session is present locally.
 * @returns {boolean}
 */
export function isAuthenticated() {
  const user = localStorage.getItem("user");
  const isAuth = localStorage.getItem("isAuthenticated");
  return !!(user && isAuth === "true");
}

/**
 * Get the current user object from localStorage.
 * @returns {object|null}
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
 * Whether the current user has tutor capability (not a role lock — users can be
 * both students and tutors).
 * @returns {boolean}
 */
export function hasTutorCapability() {
  const user = getCurrentUser();
  return user?.is_tutor === true || user?.isTutor === true;
}

// Alias for backwards compatibility.
export const isTutor = hasTutorCapability;

/**
 * Whether the current user's tutor profile is approved (enables tutor features).
 * @returns {boolean}
 */
export function isTutorApproved() {
  const user = getCurrentUser();
  return (user?.is_tutor === true || user?.isTutor === true) &&
         (user?.tutor_status === 'approved' || user?.tutorStatus === 'approved');
}
