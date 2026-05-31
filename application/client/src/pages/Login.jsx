/**
 * Login.jsx
 * ---------
 * The login page where users sign in with their SFSU email and password.
 * Validates that the email is an @sfsu.edu address and handles the
 * authentication flow with the backend API.
 *
 * Contributors: Ranjiv Jithendran
 */
import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars -- `motion` is used via <motion.*> JSX
import { motion } from "framer-motion";
import { loginUser } from "../services/api";
import GatorAuthBackground from "../components/GatorAuthBackground";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Single state object keeps the form inputs + remember-me toggle together
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
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

  const rawEmail = formData.email.trim();
  const normalizedEmail = rawEmail.toLowerCase();
  const isSFSUEmail = normalizedEmail.endsWith("@sfsu.edu");

  const validateForm = () => {
    const newErrors = {};
    
    if (!rawEmail) {
      newErrors.email = "Email is required";
    } else if (!rawEmail.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    } else if (!isSFSUEmail) {
      newErrors.email = "You must use your @sfsu.edu email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
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
      // Call the real API
      const response = await loginUser({
        email: normalizedEmail,
        password: formData.password,
      });
      
      // Store the auth token and user data from API response
      if (response.access_token) {
        localStorage.setItem("authToken", response.access_token);
      }
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("isAuthenticated", "true");

      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
      
      setLoading(false);
      
      // Check for redirect parameter
      const redirectPath = searchParams.get("redirect") || "/dashboard";
      navigate(redirectPath);
    } catch (error) {
      setLoading(false);
      // Handle API errors
      const errorMessage = error.message || "Login failed. Please try again.";
      
      // Check for specific error types
      if (errorMessage.includes("Invalid email or password")) {
        setApiError("Invalid email or password. Please check your credentials and try again.");
      } else if (errorMessage.includes("Account is")) {
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
          <div className="col-md-6 col-lg-5">
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
                    Login to TutorConnect
                  </h2>
                  <p className="text-center text-muted mb-4">
                    Sign in to access your account
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
                  <label htmlFor="email" className="form-label">
                    Email <span className="text-danger">*</span>
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
                  {formData.email && !errors.email && isSFSUEmail && (
                    <small id="emailHelp" className="form-text text-success">
                      <i className="bi bi-check-circle"></i> SFSU email verified
                    </small>
                  )}
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
                    placeholder="Enter your password"
                    aria-describedby="passwordError"
                    aria-invalid={!!errors.password}
                    required
                    minLength={8}
                  />
                  {errors.password && (
                    <div id="passwordError" className="invalid-feedback">
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="mb-4 d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  {/* Forgot password link */}
                  <Link
                    to="/forgot-password"
                    className="btn btn-link p-0 text-decoration-none"
                    aria-label="Forgot password"
                    style={{ color: '#411545' }}
                  >
                    Forgot password?
                  </Link>
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
                      Logging in...
                    </>
                  ) : (
                    "Sign In"
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
                  Don't have an account?{" "}
                  <Link to="/register" aria-label="Create a new account" style={{ color: '#411545', fontWeight: 500 }}>Create account</Link>
                </p>
                <p className="mt-2">
                  <Link to="/" aria-label="Return to home page" className="text-muted">Back to Home</Link>
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
