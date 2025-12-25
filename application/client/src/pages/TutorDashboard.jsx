/**
 * TutorDashboard.jsx
 * ------------------
 * Legacy route that redirects to the unified dashboard. Kept for backwards
 * compatibility with old bookmarks or links.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TutorDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to unified dashboard with tutor tab
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Redirecting to dashboard...</p>
    </div>
  );
}
