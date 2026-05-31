/**
 * ContactTutor.jsx
 * ----------------
 * A form that lets students send a message to a tutor about their posting.
 * This is one-way messaging—students reach out and tutors can respond via
 * the contact email provided.
 *
 * Contributors: Ranjiv Jithendran, Dhvanil Bhagat
 */
import React, { useState } from "react";
import { useSearchParams, Link, Navigate, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../hooks/useToast";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { sendTutorMessage } from "../services/messagesService";
import { isAuthenticated, getCurrentUser } from "../utils/auth";

export default function ContactTutor() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const postingId = searchParams.get("postingId");
  const postingTitle = searchParams.get("postingTitle") || "Tutor";
  const recipientUserId = searchParams.get("recipientUserId"); // Get recipient from URL

  // Auth check - redirect to login if not authenticated
  const user = getCurrentUser();
  
  const [formData, setFormData] = useState({
    messageText: "",
    contactEmail: user?.email || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    const redirectPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
  }

  // Load user email if logged in - email is now set in initial state

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.messageText.trim()) {
      newErrors.messageText = "Message is required";
    } else if (formData.messageText.trim().length < 10) {
      newErrors.messageText = "Message must be at least 10 characters";
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!formData.contactEmail.includes("@")) {
      newErrors.contactEmail = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await sendTutorMessage({
        postingId: postingId,
        postingTitle: postingTitle,
        messageText: formData.messageText.trim(),
        contactEmail: formData.contactEmail.trim(),
        recipientUserId: parseInt(recipientUserId) || 1, // Use actual recipient or fallback to 1
      });
      
      setLoading(false);
      setSubmitted(true);
      toast.success("Message sent successfully!");
      
      // Navigate to dashboard after 1.5 seconds
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Failed to send message. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                </div>
                <h2 className="mb-3">Message Sent!</h2>
                <p className="text-muted mb-4">
                  Your message has been sent to the tutor. They will contact you at <strong>{formData.contactEmail}</strong>.
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <Link to="/search" className="btn btn-primary">
                    Browse More Tutors
                  </Link>
                  <Link to="/dashboard" className="btn btn-outline-primary">
                    View My Messages
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="mb-4">
            <Link to={postingId ? `/postings/${postingId}` : "/search"} className="btn btn-outline-secondary">
              ← Back
            </Link>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title mb-4">Contact Tutor</h2>
              <p className="text-muted mb-4">
                Send a message to the tutor about: <strong>{postingTitle}</strong>
              </p>

              <form onSubmit={handleSubmit} noValidate>
                {/* Message Text */}
                <div className="mb-4">
                  <label htmlFor="messageText" className="form-label">
                    Message <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${errors.messageText ? "is-invalid" : ""}`}
                    id="messageText"
                    name="messageText"
                    rows="6"
                    value={formData.messageText}
                    onChange={handleChange}
                    placeholder="Introduce yourself and let the tutor know what you need help with..."
                    aria-describedby="messageHelp messageError"
                    aria-invalid={!!errors.messageText}
                    required
                  ></textarea>
                  <AnimatePresence>
                    {errors.messageText && (
                      <motion.div 
                        id="messageError" 
                        className="invalid-feedback"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                      >
                        {errors.messageText}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <small id="messageHelp" className="form-text text-muted">
                    Minimum 10 characters ({formData.messageText.length}/10)
                  </small>
                </div>

                {/* Contact Email */}
                <div className="mb-4">
                  <label htmlFor="contactEmail" className="form-label">
                    Your Contact Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.contactEmail ? "is-invalid" : ""}`}
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="yourname@sfsu.edu"
                    aria-describedby="emailHelp emailError"
                    aria-invalid={!!errors.contactEmail}
                    required
                  />
                  <AnimatePresence>
                    {errors.contactEmail && (
                      <motion.div 
                        id="emailError" 
                        className="invalid-feedback"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                      >
                        {errors.contactEmail}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <small id="emailHelp" className="form-text text-muted">
                    The tutor will contact you at this email address
                  </small>
                </div>

                {/* Submit */}
                <div className="d-flex gap-2">
                  <motion.button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || submitted}
                    aria-busy={loading}
                    initial={false}
                    animate={{
                      scale: submitted ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : submitted ? (
                      <>
                        <span className="me-2">✓</span>
                        Sent!
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </motion.button>
                  <Link to={postingId ? `/postings/${postingId}` : "/search"} className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

