/**
 * Profile.jsx
 * -----------
 * User profile page where users can view and edit their profile information
 * including major, bio, experience, tutoring format, and meeting location.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserProfile, updateUserProfile, updateTutorProfile, updateProfilePhoto } from "../services/api";
import { getCurrentUser, isAuthenticated } from "../components/ProtectedRoute";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export default function Profile() {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const currentUser = getCurrentUser() || {};
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // User profile fields
  const [formData, setFormData] = useState({
    // User fields
    major: "",
    profile_photo_url: "",
    
    // Tutor profile fields
    bio: "",
    years_of_experience: "",
    tutoring_format: "hybrid",
    preferred_meeting_location: "",
  });
  
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  
  // Load profile data
  useEffect(() => {
    async function loadProfile() {
      if (!currentUser.id && !currentUser.user_id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const userId = currentUser.id || currentUser.user_id;
        const response = await getUserProfile(userId);
        
        // Set user fields
        setFormData(prev => ({
          ...prev,
          major: response.user.major || "",
          profile_photo_url: response.user.profile_photo_url || "",
        }));
        
        setProfilePhotoUrl(response.user.profile_photo_url || null);
        
        // Set tutor profile fields if exists
        if (response.tutor_profile) {
          setFormData(prev => ({
            ...prev,
            bio: response.tutor_profile.bio || "",
            years_of_experience: response.tutor_profile.years_of_experience || "",
            tutoring_format: response.tutor_profile.tutoring_format || "hybrid",
            preferred_meeting_location: response.tutor_profile.preferred_meeting_location || "",
          }));
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [currentUser.id, currentUser.user_id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    if (error) setError(null);
    if (success) setSuccess(false);
  };
  
  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setPhotoError("Please upload a PNG or JPG image file");
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setPhotoError("Image size must be less than 5MB");
      return;
    }
    
    setPhotoError(null);
    setUploadingPhoto(true);
    
    try {
      // Convert to base64 data URL
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64DataUrl = reader.result;
        const userId = currentUser.id || currentUser.user_id;
        
        try {
          const response = await updateProfilePhoto(userId, base64DataUrl);
          
          // Update local state
          setProfilePhotoUrl(response.user.profile_photo_url);
          setFormData(prev => ({
            ...prev,
            profile_photo_url: response.user.profile_photo_url
          }));
          
          // Update localStorage user object
          const updatedUser = { ...currentUser, profile_photo_url: response.user.profile_photo_url };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
          console.error("Failed to update profile photo:", err);
          setPhotoError(err.message || "Failed to update profile picture");
        } finally {
          setUploadingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Failed to read file:", err);
      setPhotoError("Failed to read image file");
      setUploadingPhoto(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      const userId = currentUser.id || currentUser.user_id;
      
      // Update user profile
      const userUpdate = {
        major: formData.major || null,
      };
      await updateUserProfile(userId, userUpdate);
      
      // Update tutor profile
      const tutorUpdate = {
        bio: formData.bio || null,
        years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null,
        tutoring_format: formData.tutoring_format || null,
        preferred_meeting_location: formData.preferred_meeting_location || null,
      };
      await updateTutorProfile(userId, tutorUpdate);
      
      // Update localStorage
      const updatedUser = { ...currentUser, major: formData.major };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <motion.div
            className="card shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
          >
            <div className="card-header bg-light">
              <h4 className="mb-0 fw-bold" style={{ color: "#411545", fontSize: "1.5rem" }}>
                <i className="bi bi-person-circle me-2" style={{ color: "#411545" }}></i>My Profile
              </h4>
            </div>
            
            <div className="card-body p-4">
              {/* Success/Error Messages */}
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  Profile updated successfully!
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSuccess(false)}
                    aria-label="Close"
                  ></button>
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError(null)}
                    aria-label="Close"
                  ></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Profile Picture Section */}
                <div className="text-center mb-4 pb-4 border-bottom">
                  <div className="position-relative d-inline-block">
                    {profilePhotoUrl && profilePhotoUrl.trim() ? (
                      <>
                        <img
                          src={profilePhotoUrl}
                          alt={currentUser.first_name || 'Profile'}
                          className="rounded-circle shadow-sm"
                          style={{ 
                            width: "120px", 
                            height: "120px", 
                            objectFit: "cover"
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm"
                          style={{ 
                            width: "120px", 
                            height: "120px", 
                            fontSize: "48px", 
                            fontWeight: "600",
                            display: 'none',
                            backgroundColor: "#411545"
                          }}
                        >
                          {currentUser.first_name ? currentUser.first_name[0] : currentUser.email?.[0] || '?'}
                        </div>
                      </>
                    ) : (
                      <div 
                        className="rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm"
                        style={{ 
                          width: "120px", 
                          height: "120px", 
                          fontSize: "48px", 
                          fontWeight: "600",
                          backgroundColor: "#411545"
                        }}
                      >
                        {currentUser.first_name ? currentUser.first_name[0] : currentUser.email?.[0] || '?'}
                      </div>
                    )}
                    <label 
                      htmlFor="profilePhotoUpload" 
                      className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        width: "44px", 
                        height: "44px", 
                        cursor: "pointer",
                        backgroundColor: "#411545",
                        color: "#ffffff",
                        border: "4px solid #ffffff",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(65, 21, 69, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)",
                        transition: "all 0.2s ease",
                        zIndex: 10
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#5a1d61";
                        e.target.style.transform = "scale(1.2)";
                        e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(65, 21, 69, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#411545";
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(65, 21, 69, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)";
                      }}
                      title="Upload profile picture"
                    >
                      <i className="bi bi-camera-fill" style={{ fontSize: "20px", fontWeight: "bold", color: "#ffffff", textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}></i>
                    </label>
                    <input
                      type="file"
                      id="profilePhotoUpload"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleProfilePhotoUpload}
                      style={{ display: 'none' }}
                      disabled={uploadingPhoto}
                    />
                  </div>
                  <h5 className="mt-3 mb-1">
                    {currentUser.first_name} {currentUser.last_name}
                  </h5>
                  <p className="text-muted mb-0">{currentUser.email}</p>
                  {photoError && (
                    <small className="text-danger d-block mt-2">{photoError}</small>
                  )}
                  {uploadingPhoto && (
                    <small className="text-muted d-block mt-2">
                      <i className="bi bi-hourglass-split me-1"></i>Uploading...
                    </small>
                  )}
                </div>
                
                {/* User Information Section */}
                <div className="mb-4">
                  <h5 className="mb-3" style={{ color: '#411545' }}>Basic Information</h5>
                  
                  <div className="mb-3">
                    <label htmlFor="major" className="form-label">
                      Major <span className="text-muted">(Optional)</span>
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
                </div>
                
                {/* Tutor Profile Section */}
                <div className="mb-4">
                  <h5 className="mb-3" style={{ color: '#411545' }}>Tutor Profile</h5>
                  <p className="text-muted small mb-3">
                    Fill out this section if you're interested in becoming a tutor or already tutor.
                  </p>
                  
                  <div className="mb-3">
                    <label htmlFor="bio" className="form-label">
                      Bio <span className="text-muted">(Optional)</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="bio"
                      name="bio"
                      rows="4"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about your tutoring experience, teaching style, and expertise..."
                    />
                    <small className="text-muted">
                      {formData.bio.length} characters
                    </small>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="years_of_experience" className="form-label">
                      Years of Experience <span className="text-muted">(Optional)</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="years_of_experience"
                      name="years_of_experience"
                      min="0"
                      max="50"
                      value={formData.years_of_experience}
                      onChange={handleChange}
                      placeholder="e.g., 2"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="tutoring_format" className="form-label">
                      Tutoring Format <span className="text-muted">(Optional)</span>
                    </label>
                    <select
                      className="form-select"
                      id="tutoring_format"
                      name="tutoring_format"
                      value={formData.tutoring_format}
                      onChange={handleChange}
                    >
                      <option value="hybrid">Hybrid (In-Person & Online)</option>
                      <option value="in_person">In-Person Only</option>
                      <option value="online">Online Only</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="preferred_meeting_location" className="form-label">
                      Preferred Meeting Location <span className="text-muted">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="preferred_meeting_location"
                      name="preferred_meeting_location"
                      value={formData.preferred_meeting_location}
                      onChange={handleChange}
                      placeholder="e.g., Library, Zoom, Student Center"
                    />
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/dashboard")}
                  >
                    <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sfsu-purple"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>Save Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

