/**
 * PostingDetail.jsx
 * -----------------
 * Shows the full details of a tutor posting including their bio, subjects,
 * courses, availability, and rate. Users can contact the tutor from here
 * (requires sign-in).
 *
 * Contributors: Ranjiv Jithendran, Dhvanil Bhagat
 */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { getPostingById, updatePostingStatus } from "../services/postingsService";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { isAuthenticated } from "../components/ProtectedRoute";

export default function PostingDetail() {
  const { postingId } = useParams();
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [posting, setPosting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.3,
        delay: prefersReducedMotion ? 0 : i * 0.1,
      },
    }),
  };

  useEffect(() => {
    async function fetchPosting() {
      setLoading(true);
      setError(null);
      
      try {
        const found = await getPostingById(postingId);
        
        if (found) {
          setPosting(found);
        } else {
          setError("Posting not found");
        }
      } catch (err) {
        console.error("Failed to fetch posting:", err);
        setError(err.message || "Failed to load posting");
      } finally {
        setLoading(false);
      }
    }

    if (postingId) {
      fetchPosting();
    }
  }, [postingId]);

  const handleBackToPostings = () => {
    // Check if user owns this posting
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (posting && posting.userId === currentUser.id) {
      // Navigate to My postings tab
      navigate('/dashboard');
      // Set active tab to my-postings after navigation
      setTimeout(() => {
        sessionStorage.setItem("dashboardTab", "my-postings");
      }, 100);
    } else {
      // Navigate to All postings tab
      navigate('/dashboard');
      // Set active tab to all-postings after navigation
      setTimeout(() => {
        sessionStorage.setItem("dashboardTab", "all-postings");
      }, 100);
    }
  };

  const location = useLocation();

  const handleContactTutor = () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Redirect to login with return path
      const currentPath = location.pathname + location.search;
      const redirectPath = encodeURIComponent(currentPath);
      navigate(`/login?redirect=${redirectPath}`);
      return;
    }

    const postingTitle = posting?.title || posting?.name || "Tutor";
    const recipientUserId = posting?.user_id || posting?.userId;
    navigate(`/contact-tutor?postingId=${postingId}&postingTitle=${encodeURIComponent(postingTitle)}&recipientUserId=${recipientUserId}`);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading posting details...</p>
        </div>
      </div>
    );
  }

  if (error || !posting) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Posting Not Found</h4>
          <p>{error || "The posting you're looking for doesn't exist."}</p>
          <hr />
          <button onClick={handleBackToPostings} className="btn btn-primary">
            Back to Postings
          </button>
        </div>
      </div>
    );
  }

  // Check if in dev mode (allow approval toggle)
  const isDev = import.meta.env.DEV || window.location.hostname === 'localhost';
  const canToggleApproval = isDev;

  const handleToggleApproval = () => {
    if (!posting) return;
    
    const newStatus = posting.status === "approved" ? "pending" : "approved";
    const updated = updatePostingStatus(posting.id, newStatus);
    
    if (updated) {
      setPosting(updated);
      alert(`Posting status changed to: ${newStatus}`);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <button onClick={handleBackToPostings} className="btn btn-outline-secondary">
          ← Back to Postings
        </button>
        {canToggleApproval && posting && (
          <button
            className="btn btn-sm btn-warning"
            onClick={handleToggleApproval}
            title="Dev Only: Toggle Approval Status"
          >
            {posting.status === "approved" ? "⚠️ Mark Pending" : "✓ Approve"}
          </button>
        )}
      </div>

      <div className="row">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              {/* Header */}
              <div className="d-flex align-items-start justify-content-between mb-4">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <h1 className="card-title mb-0">{posting.title || posting.name}</h1>
                    {posting.status && (
                      <span className={`badge ${posting.status === "approved" ? "bg-success" : "bg-warning"}`}>
                        {posting.status === "approved" ? "Approved" : "Pending"}
                      </span>
                    )}
                  </div>
                  {posting.rate && (
                    <h4 className="mb-0" style={{ color: '#411545' }}>${posting.rate}/hour</h4>
                  )}
                </div>
                <div className="text-end">
                  <button
                    className="btn btn-sfsu-purple"
                    onClick={handleContactTutor}
                    disabled={posting.status === "pending"}
                    title={posting.status === "pending" ? "This posting is pending approval" : 
                           !isAuthenticated() ? "Sign in to contact this tutor" : ""}
                  >
                    {isAuthenticated() ? "Contact Tutor" : "Sign In to Contact"}
                  </button>
                </div>
              </div>

              {/* Tutor Profile Picture */}
              <div className="text-center mb-4">
                {posting.profilePhotoUrl && posting.profilePhotoUrl.trim() ? (
                  <>
                    <img
                      src={posting.profilePhotoUrl}
                      alt={posting.name || 'Tutor'}
                      className="rounded-circle mx-auto mb-3 shadow"
                      style={{ 
                        width: "150px", 
                        height: "150px", 
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
                      style={{ 
                        width: "150px", 
                        height: "150px", 
                        fontSize: "48px",
                        backgroundColor: "#411545", 
                        fontWeight: "600",
                        display: 'none'
                      }}
                    >
                      {posting.name ? posting.name.split(' ').map(n => n[0]).join('') : '?'}
                    </div>
                  </>
                ) : (
                  <div 
                    className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
                    style={{ 
                      width: "150px", 
                      height: "150px", 
                      fontSize: "48px", 
                      fontWeight: "600",
                      backgroundColor: "#411545"
                    }}
                  >
                    {posting.name ? posting.name.split(' ').map(n => n[0]).join('') : '?'}
                  </div>
                )}
              </div>

              {/* Bio */}
              {posting.bio && (
                <motion.div 
                  className="mb-4"
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariants}
                >
                  <h5>About</h5>
                  <p className="text-muted" style={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
                    {posting.bio}
                  </p>
                </motion.div>
              )}

              {/* Subjects */}
              {posting.subjects && posting.subjects.length > 0 && (
                <motion.div 
                  className="mb-4"
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariants}
                >
                  <h5>Subjects</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {posting.subjects.map((subject, idx) => (
                      <span key={idx} className="badge bg-primary bg-opacity-10 text-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                        {subject}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Courses */}
              {posting.courses && posting.courses.length > 0 && (
                <motion.div 
                  className="mb-4"
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariants}
                >
                  <h5>Courses</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {posting.courses.map((course, idx) => (
                      <span key={idx} className="badge bg-secondary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                        {course}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Availability */}
              {posting.availability && posting.availability.length > 0 && (
                <motion.div 
                  className="mb-4"
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariants}
                >
                  <h5>Availability</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {posting.availability.map((slot, idx) => (
                      <span key={idx} className="badge bg-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                        {slot}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Contact Button at Bottom */}
              <div className="mt-4 pt-4 border-top">
                <button
                  className="btn btn-sfsu-purple btn-lg w-100"
                  onClick={handleContactTutor}
                  disabled={posting.status === "pending"}
                >
                  {isAuthenticated() ? "Contact Tutor" : "Sign In to Contact Tutor"}
                </button>
                {!isAuthenticated() && (
                  <p className="text-center text-muted mt-2 mb-0">
                    <small>You need to be signed in to contact tutors. <Link to="/register">Create an account</Link></small>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with Quick Info */}
        <div className="col-12 col-lg-4 mt-4 mt-lg-0">
          <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
            <div className="card-body">
              <h5 className="card-title mb-3">Quick Info</h5>
              
              {/* Tutor Profile Picture in Sidebar */}
              {posting.name && (
                <div className="text-center mb-3">
                  {posting.profilePhotoUrl && posting.profilePhotoUrl.trim() ? (
                    <>
                      <img
                        src={posting.profilePhotoUrl}
                        alt={posting.name || 'Tutor'}
                        className="rounded-circle mx-auto mb-2 shadow-sm"
                        style={{ 
                          width: "80px", 
                          height: "80px", 
                          objectFit: "cover"
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm"
                        style={{ 
                          width: "80px", 
                          height: "80px", 
                          fontSize: "28px", 
                          fontWeight: "600",
                          display: 'none',
                          backgroundColor: "#411545"
                        }}
                      >
                        {posting.name ? posting.name.split(' ').map(n => n[0]).join('') : '?'}
                      </div>
                    </>
                  ) : (
                    <div 
                      className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm"
                      style={{ 
                        width: "80px", 
                        height: "80px", 
                        fontSize: "28px", 
                        fontWeight: "600",
                        backgroundColor: "#411545"
                      }}
                    >
                      {posting.name ? posting.name.split(' ').map(n => n[0]).join('') : '?'}
                    </div>
                  )}
                  <strong className="d-block mt-2">{posting.name}</strong>
                </div>
              )}
              
              {posting.rate && (
                <div className="mb-3">
                  <strong>Rate:</strong>
                  <p className="mb-0" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#411545' }}>
                    ${posting.rate}/hour
                  </p>
                </div>
              )}

              {posting.courses && posting.courses.length > 0 && (
                <div className="mb-3">
                  <strong>Courses Offered:</strong>
                  <p className="mb-0">{posting.courses.length} course{posting.courses.length !== 1 ? 's' : ''}</p>
                </div>
              )}

              <div className="mt-4">
                <button
                  className="btn btn-sfsu-purple w-100"
                  onClick={handleContactTutor}
                  disabled={posting.status === "pending"}
                >
                  {isAuthenticated() ? "Contact Tutor" : "Sign In to Contact"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

