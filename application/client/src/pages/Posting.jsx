/**
 * Posting.jsx
 * -----------
 * The posting creation and editing page for tutors. Lets them enter their
 * bio, select subjects and courses, set their hourly rate, and specify
 * availability. Submissions go to the backend for admin approval.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import CourseQuickPick from "../components/ui/CourseQuickPick";
import { MOCK_SUBJECTS, MOCK_AVAILABILITY } from "../mocks/ui-demo";
import { useToast } from "../hooks/useToast";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { createPosting, getPostingById } from "../services/postingsService";

export default function Posting() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postingId = searchParams.get("id");

  // Check if user is logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      // Redirect to login with return path
      navigate(`/login?redirect=/post${postingId ? `?id=${postingId}` : ''}`);
    }
  }, [navigate, postingId]);

  // Master form model backing both the editor and real-time preview card
  const [formData, setFormData] = useState({
    title: "",
    subjects: [],
    course: "", // Course label (e.g., "CSC 648 - Software Engineering")
    courseId: null, // Course ID from database
    rate: "",
    bio: "",
    availability: [],
    imageUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // store a data URL for the preview pane
  const toast = useToast();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Load existing posting if editing
  useEffect(() => {
    async function loadPosting() {
      if (postingId) {
        try {
          const existing = await getPostingById(postingId);
          if (existing) {
            setFormData({
              title: existing.title || "",
              subjects: existing.subjects || [],
              course: existing.course || (existing.courses && existing.courses.length > 0 ? existing.courses[0] : ""),
              courseId: existing.course_id || null,
              rate: existing.rate?.toString() || "",
              bio: existing.bio || "",
              availability: existing.availability || [],
              imageUrl: existing.imageUrl || "",
            });
          }
        } catch (error) {
          console.error("Failed to load posting:", error);
        }
      }
    }
    loadPosting();
  }, [postingId]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubjectChange = (selectedSubjects) => {
    setFormData({ ...formData, subjects: selectedSubjects });
  };

  const handleCourseChange = (selectedCourse) => {
    if (!selectedCourse) {
      setFormData({ ...formData, course: "", courseId: null });
      return;
    }
    const label = `${selectedCourse.department} ${selectedCourse.course_number} - ${selectedCourse.title}`;
    setFormData({ ...formData, course: label, courseId: selectedCourse.id });
  };

  const handleAvailabilityToggle = (slot) => {
    const newAvailability = formData.availability.includes(slot)
      ? formData.availability.filter((s) => s !== slot)
      : [...formData.availability, slot];
    setFormData({ ...formData, availability: newAvailability });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedImage(null);
      setImagePreview(null);
      setFormData({ ...formData, imageUrl: "" });
      return;
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, image: "Please upload a PNG or JPG image file" });
      e.target.value = ""; // Clear the input
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setErrors({ ...errors, image: "Image size must be less than 5MB" });
      e.target.value = ""; // Clear the input
      return;
    }

    // Clear any previous errors
    if (errors.image) {
      setErrors({ ...errors, image: null });
    }

    // Store the file and create preview
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData({ ...formData, imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: "" });
    // Reset file input
    const fileInput = document.getElementById('imageUpload');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (formData.subjects.length === 0) {
      newErrors.subjects = "At least one subject is required";
    }
    
    if (!formData.rate || parseFloat(formData.rate) <= 0) {
      newErrors.rate = "Valid rate is required";
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (formData.bio.length < 50) {
      newErrors.bio = "Bio must be at least 50 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    // Create/update posting using service
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const postingData = {
      title: formData.title,
      name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email?.split('@')[0] || "Tutor",
      subjects: formData.subjects,
      courses: formData.course ? [formData.course] : [],
      rate: parseFloat(formData.rate),
      bio: formData.bio,
      availability: formData.availability,
      imageUrl: formData.imageUrl,
      userId: user.id || user.user_id || null,
      courseId: formData.courseId || null,
    };

    if (postingId) {
      // TODO: Implement update endpoint in backend
      // For now, update in localStorage
      const existingPostings = JSON.parse(localStorage.getItem('mockPostings') || '[]');
      const index = existingPostings.findIndex(p => p.id === postingId || p.id === parseInt(postingId));
      if (index >= 0) {
        existingPostings[index] = { ...existingPostings[index], ...postingData };
        localStorage.setItem('mockPostings', JSON.stringify(existingPostings));
      }
    } else {
      createPosting(postingData);
    }

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Posting created successfully! It may take up to 24 hours to be approved.");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }, 500);
  };

  // Show loading/redirect message if not authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Redirecting...</span>
          </div>
          <p className="mt-3 text-muted">Please log in to create a posting...</p>
          <Link to="/login" className="btn btn-primary mt-3">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>{postingId ? "Edit Posting" : "Create New Posting"}</h1>
            <Link to="/dashboard" className="btn btn-outline-secondary">
              Cancel
            </Link>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Title */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., CSC 648 Tutor - Experienced TA"
                aria-describedby="titleError"
                aria-invalid={!!errors.title}
                required
              />
              <AnimatePresence>
                {errors.title && (
                  <motion.div 
                    id="titleError" 
                    className="invalid-feedback"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                  >
                    {errors.title}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Subjects */}
            <div className="mb-3">
              <label className="form-label">
                Subjects <span className="text-danger">*</span>
              </label>
              <div className="d-flex flex-wrap gap-2">
                {MOCK_SUBJECTS.map((subject) => (
                  <div key={subject.slug} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`subject-${subject.slug}`}
                      checked={formData.subjects.includes(subject.slug)}
                      onChange={() => {
                        const newSubjects = formData.subjects.includes(subject.slug)
                          ? formData.subjects.filter((s) => s !== subject.slug)
                          : [...formData.subjects, subject.slug];
                        handleSubjectChange(newSubjects);
                      }}
                    />
                    <label className="form-check-label" htmlFor={`subject-${subject.slug}`}>
                      {subject.name}
                    </label>
                  </div>
                ))}
              </div>
              {errors.subjects && (
                <div className="invalid-feedback d-block">{errors.subjects}</div>
              )}
            </div>

            {/* Courses - SFSU Quick Pick */}
            <CourseQuickPick
              label="SFSU Course"
              value={formData.courseId}
              onChange={handleCourseChange}
            />

            {/* Rate */}
            <div className="mb-3">
              <label htmlFor="rate" className="form-label">
                Rate per Hour ($) <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className={`form-control ${errors.rate ? "is-invalid" : ""}`}
                  id="rate"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  placeholder="25"
                  min="0"
                  step="0.01"
                  aria-describedby="rateError"
                  aria-invalid={!!errors.rate}
                  required
                />
                {errors.rate && (
                  <div id="rateError" className="invalid-feedback">
                    {errors.rate}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mb-3">
              <label htmlFor="bio" className="form-label">
                Bio/Description <span className="text-danger">*</span>
              </label>
              <textarea
                className={`form-control ${errors.bio ? "is-invalid" : ""}`}
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="6"
                placeholder="Tell students about your tutoring experience, teaching style, and what you can help with..."
                aria-describedby="bioHelp bioError"
                aria-invalid={!!errors.bio}
                required
              ></textarea>
              {errors.bio && (
                <div id="bioError" className="invalid-feedback">
                  {errors.bio}
                </div>
              )}
              <small id="bioHelp" className="form-text text-muted">
                Minimum 50 characters ({formData.bio.length}/50)
              </small>
            </div>

            {/* Availability */}
            <div className="mb-3">
              <label className="form-label">Availability</label>
              <div className="d-flex flex-wrap gap-2">
                {MOCK_AVAILABILITY.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`btn btn-sm ${
                      formData.availability.includes(slot)
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => handleAvailabilityToggle(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label htmlFor="imageUpload" className="form-label">
                Profile Image (Optional)
              </label>
              {imagePreview ? (
                <div className="border rounded p-3">
                  <div className="position-relative d-inline-block w-100" style={{ maxWidth: "200px" }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-thumbnail w-100"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                      onClick={handleRemoveImage}
                      aria-label="Remove image"
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                  <div className="mt-2">
                    <small className="text-muted d-block">
                      {selectedImage?.name} ({(selectedImage?.size / 1024).toFixed(2)} KB)
                    </small>
                  </div>
                </div>
              ) : (
                <div className="border rounded p-3 text-center" style={{ minHeight: "150px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <i className="bi bi-image fs-1 text-muted mb-2"></i>
                  <input
                    type="file"
                    className="form-control"
                    id="imageUpload"
                    name="imageUpload"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageChange}
                    style={{ maxWidth: "300px" }}
                    aria-describedby="imageHelp imageError"
                  />
                  <small id="imageHelp" className="form-text text-muted mt-2">
                    PNG or JPG only (max 5MB)
                  </small>
                </div>
              )}
              {errors.image && (
                <div id="imageError" className="invalid-feedback d-block">
                  {errors.image}
                </div>
              )}
            </div>

            {/* Approval Disclaimer */}
            <div className="alert alert-info mb-4">
              <i className="bi bi-info-circle me-2"></i>
              Your listing may take up to 24 hours to be approved.
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
                    Saving...
                  </>
                ) : submitted ? (
                  <>
                    <span className="me-2">✓</span>
                    Submitted!
                  </>
                ) : (
                  postingId ? "Update Posting" : "Create Posting"
                )}
              </motion.button>
              <Link to="/dashboard" className="btn btn-outline-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

