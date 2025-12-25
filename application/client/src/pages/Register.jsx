/**
 * Register.jsx
 * ------------
 * The registration page for new users. Collects their name, SFSU email,
 * and password. Validates that the email ends with @sfsu.edu and requires
 * users to accept the terms of service before creating an account.
 *
 * Contributors: Ranjiv Jithendran, Dhvanil Bhagat
 */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import SFSUEmailHint from "../components/ui/SFSUEmailHint";
import { registerUser } from "../services/api";
import GatorAuthBackground from "../components/GatorAuthBackground";

export default function Register() {
  const navigate = useNavigate();
  // Controlled form fields plus the terms acceptance checkbox
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    major: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const rawEmail = formData.email.trim();
  const normalizedEmail = rawEmail.toLowerCase();
  const isSFSUEmail = normalizedEmail.endsWith("@sfsu.edu");

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
    // Clear API error when user types
    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    
    if (!rawEmail) {
      newErrors.email = "Email is required";
    } else if (!rawEmail.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    } else if (!isSFSUEmail) {
      newErrors.email = "You must register with your @sfsu.edu email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms of service";
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
    setApiError(null);
    
    try {
      // Prepare data for API
      const userData = {
        email: normalizedEmail,
        password: formData.password,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        major: formData.major.trim() || null,
      };
      
      // Call the real API
      const response = await registerUser(userData);
      
      // Store user data from API response
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("isAuthenticated", "true");
      
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      // Handle API errors
      const errorMessage = error.message || "Registration failed. Please try again.";
      
      // Check for specific error types
      if (errorMessage.includes("already registered") || errorMessage.includes("already exists")) {
        setApiError("This email is already registered. Please login or use a different email.");
      } else if (errorMessage.includes("SFSU email") || errorMessage.includes("@sfsu.edu")) {
        setApiError("You must register with a valid @sfsu.edu email address.");
      } else if (errorMessage.includes("Password must be")) {
        setApiError(errorMessage);
      } else if (errorMessage.includes("Network") || errorMessage.includes("fetch")) {
        setApiError("Unable to connect to server. Please check your internet connection.");
      } else {
        setApiError(errorMessage);
      }
    }
  };

  return (
    <>
      <GatorAuthBackground />
      <div className="container py-5" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            <motion.div
              className="card shadow-sm"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ 
                background: '#faf8f2',
                border: '1px solid rgba(65, 21, 69, 0.1)',
              }}
            >
              <div className="card-body p-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <h2 className="card-title text-center mb-4" style={{ color: '#411545' }}>
                    Create Your Account
                  </h2>
                  <p className="text-center text-muted mb-4">
                    Join TutorConnect to connect with tutors and students
                  </p>
                </motion.div>

              {/* API Error Alert */}
              {apiError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {apiError}
                  <button 
                    type="button" 
                    className="btn-close" 
                    aria-label="Close"
                    onClick={() => setApiError(null)}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    aria-describedby="first_nameError"
                    aria-invalid={!!errors.first_name}
                    required
                  />
                  {errors.first_name && (
                    <div id="first_nameError" className="invalid-feedback">
                      {errors.first_name}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="last_name" className="form-label">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    aria-describedby="last_nameError"
                    aria-invalid={!!errors.last_name}
                    required
                  />
                  {errors.last_name && (
                    <div id="last_nameError" className="invalid-feedback">
                      {errors.last_name}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    SFSU Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="yourname@sfsu.edu"
                    aria-describedby="emailHelp emailError"
                    aria-invalid={!!errors.email}
                    required
                  />
                  {errors.email && (
                    <div id="emailError" className="invalid-feedback">
                      {errors.email}
                    </div>
                  )}
                  <SFSUEmailHint email={formData.email} hasError={!!errors.email} />
                </div>

                <div className="mb-3">
                  <label htmlFor="major" className="form-label">
                    Major (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="major"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-describedby="passwordHelp passwordError"
                    aria-invalid={!!errors.password}
                    minLength={8}
                    required
                  />
                  {errors.password && (
                    <div id="passwordError" className="invalid-feedback">
                      {errors.password}
                    </div>
                  )}
                  <small id="passwordHelp" className="form-text text-muted">
                    Minimum 8 characters
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    aria-describedby="confirmPasswordError"
                    aria-invalid={!!errors.confirmPassword}
                    minLength={8}
                    required
                  />
                  {errors.confirmPassword && (
                    <div id="confirmPasswordError" className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className={`form-check-input ${errors.termsAccepted ? "is-invalid" : ""}`}
                      type="checkbox"
                      id="termsAccepted"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      aria-invalid={!!errors.termsAccepted}
                    />
                    <label className="form-check-label" htmlFor="termsAccepted">
                      I accept the <Link to="/terms" target="_blank">Terms of Service</Link>{" "}
                      <span className="text-danger">*</span>
                    </label>
                    {errors.termsAccepted && (
                      <div className="invalid-feedback d-block">
                        {errors.termsAccepted}
                      </div>
                    )}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="btn btn-sfsu-purple w-100 mb-3"
                  disabled={loading}
                  aria-busy={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              </form>

              <motion.div 
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <p className="mb-0">
                  Already have an account? <Link to="/login" style={{ color: '#411545', fontWeight: 500 }}>Login here</Link>
                </p>
                <p className="mt-2">
                  <Link to="/" className="text-muted">Back to Home</Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
}
