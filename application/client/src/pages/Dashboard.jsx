/**
 * Dashboard.jsx
 * -------------
 * The main dashboard where users can see their messages, browse tutors,
 * and (if approved as a tutor) manage their postings and view received
 * messages. Everyone gets the core features, and tutors get extra tabs.
 *
 * Contributors: Ranjiv Jithendran, Dhvanil Bhagat
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { getUserMessages } from "../services/messagesService";
import { getPostings, updateProfilePhoto, getConnectionRequests, acceptConnectionRequest, declineConnectionRequest } from "../services/api";
import { getCurrentUser, isTutorApproved } from "../utils/auth";
import { createReview } from "../services/api";
import { useNavigate } from "react-router-dom";

function RatingForm({ postingId, postingTitle, currentUserId, submittingReviewId, setSubmittingReviewId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!postingId || !currentUserId) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;
    try {
      setSubmittingReviewId(postingId);
      setError(null);
      await createReview({
        posting_id: postingId,
        rating,
        comment,
        student_user_id: currentUserId,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError(err.message || "Failed to submit review");
    } finally {
      setSubmittingReviewId(null);
    }
  };

  if (success) {
    return (
      <div className="alert alert-success py-2 mb-0">
        <small>
          Thank you for rating <strong>{postingTitle || "this tutor"}</strong>.
        </small>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex align-items-center mb-2">
        <label className="form-label me-2 mb-0" htmlFor={`rating-${postingId}`}>
          Rating:
        </label>
        <select
          id={`rating-${postingId}`}
          className="form-select form-select-sm"
          style={{ width: "90px" }}
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value, 10))}
        >
          <option value={5}>5 ★</option>
          <option value={4}>4 ★</option>
          <option value={3}>3 ★</option>
          <option value={2}>2 ★</option>
          <option value={1}>1 ★</option>
        </select>
      </div>
      <div className="mb-2">
        <textarea
          className="form-control form-control-sm"
          rows={2}
          placeholder="Optional comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      {error && (
        <small className="text-danger d-block mb-1">
          {error}
        </small>
      )}
      <button
        type="submit"
        className="btn btn-sm btn-sfsu-purple w-100"
        disabled={submittingReviewId === postingId}
      >
        {submittingReviewId === postingId ? "Submitting..." : "Submit Rating"}
      </button>
    </form>
  );
}

export default function Dashboard() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const navigate = useNavigate();
  
  // Get current user and check if they have tutor capabilities (additional features)
  // Note: Having tutor capability does NOT remove student features - users can do both!
  const currentUser = getCurrentUser() || {};
  const canTutor = isTutorApproved(); // Has additional tutor features enabled

  // Note: authentication is enforced by the <ProtectedRoute> wrapper in App.jsx,
  // so there is no in-component early return here. Returning before the hooks
  // below would violate the Rules of Hooks (hooks must run in the same order on
  // every render).

  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = sessionStorage.getItem("dashboardTab");
    // Default to messages sent, but respect saved tab if valid
    if (savedTab === "my-postings" && !canTutor) {
      return "student"; // Tutor tabs only available if approved as tutor
    }
    return savedTab || "student";
  });

  useEffect(() => {
    sessionStorage.setItem("dashboardTab", activeTab);
  }, [activeTab]);

  // Load messages using service (backend + fallback)
  const [storedMessages, setStoredMessages] = useState([]);
  const [tutorPostings, setTutorPostings] = useState([]);
  const [loadingPostings, setLoadingPostings] = useState(true);
  const [submittingReviewId, setSubmittingReviewId] = useState(null);
  
  useEffect(() => {
    async function loadMessages() {
      const messages = await getUserMessages();
      setStoredMessages(messages);
    }
    loadMessages();
  }, []);
  
  // Load postings from backend API
  const [allPostings, setAllPostings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loadingMyListings, setLoadingMyListings] = useState(false);
  
  // Profile picture upload state
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(currentUser.profile_photo_url || null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  
  // Connection Requests state (from Messages page)
  const [connectionRequestsTab, setConnectionRequestsTab] = useState("incoming"); // "incoming" or "sent"
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState(null);
  
  // Helper function to compress/resize image
  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression
          const base64 = canvas.toDataURL('image/jpeg', quality);
          resolve(base64);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
    
    // Validate file size (max 5MB before compression)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setPhotoError("Image size must be less than 5MB. Please use a smaller file.");
      return;
    }
    
    setPhotoError(null);
    setUploadingPhoto(true);
    
    try {
      // Compress and resize image before converting to base64
      let base64DataUrl = await compressImage(file, 800, 800, 0.8);
      
      // Check compressed size (base64 is ~33% larger than binary)
      const base64Size = (base64DataUrl.length * 3) / 4;
      const maxBase64Size = 3 * 1024 * 1024; // 3MB max after base64 encoding
      
      if (base64Size > maxBase64Size) {
        // Try more aggressive compression
        base64DataUrl = await compressImage(file, 600, 600, 0.7);
        const compressedSize = (base64DataUrl.length * 3) / 4;
        if (compressedSize > maxBase64Size) {
          setPhotoError("Image is too large even after compression. Please use a smaller image.");
          setUploadingPhoto(false);
          return;
        }
      }
      
      // Upload the compressed image
      const response = await updateProfilePhoto(currentUser.id || currentUser.user_id, base64DataUrl);
      
      // Update local state
      setProfilePhotoUrl(response.user.profile_photo_url);
      
      // Update localStorage user object
      const updatedUser = { ...currentUser, profile_photo_url: response.user.profile_photo_url };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Show success message
      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error("Failed to update profile photo:", err);
      // Provide more helpful error messages
      let errorMessage = "Failed to update profile picture";
      if (err.message) {
        if (err.message.includes("413") || err.message.includes("too large") || err.message.includes("Payload")) {
          errorMessage = "Image is too large. The server needs to be configured to allow larger uploads. Please contact support or try a smaller image.";
        } else if (err.message.includes("400") || err.message.includes("Validation")) {
          errorMessage = "Invalid image format. Please use PNG or JPG.";
        } else if (err.message.includes("Network") || err.message.includes("fetch")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          errorMessage = err.message;
        }
      }
      setPhotoError(errorMessage);
    } finally {
      setUploadingPhoto(false);
    }
  };
  
  // Function to reload listings - can be called manually
  const reloadListings = React.useCallback(async () => {
    try {
      setLoadingPostings(true);
      
      if (activeTab === "my-postings" && currentUser.id) {
        // Fetch user's postings from backend
        const postings = await getPostings({ user_id: currentUser.id });
        
        const formattedPostings = postings.map(p => ({
          id: p.id,
          title: p.title,
          subjects: extractSubjects(p.description),
          courses: [],
          rate: extractRate(p.description) || 0,
          status: p.status, // Use status directly from backend
          views: 0,
          messages: storedMessages.filter(m => m.postingId === p.id).length,
          createdAt: p.created_at,
        }));
        
        setTutorPostings(formattedPostings);
      } else if (activeTab === "my-listings" && currentUser.id) {
        // Fetch user's listings from backend (all users, not just tutors)
        setLoadingMyListings(true);
        try {
          const postings = await getPostings({ user_id: currentUser.id });
          
          const formattedPostings = postings.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            subjects: extractSubjects(p.description),
            courses: [],
            rate: extractRate(p.description) || 0,
            status: p.status, // Use status directly from backend - no fallback
            views: 0,
            messages: storedMessages.filter(m => m.postingId === p.id).length,
            createdAt: p.created_at,
            course_id: p.course_id,
          }));
          
          setMyListings(formattedPostings);
        } catch (error) {
          console.error('Failed to load my listings:', error);
          setMyListings([]);
        } finally {
          setLoadingMyListings(false);
        }
      } else if (activeTab === "all-postings") {
        // Fetch all approved postings
        const postings = await getPostings({ status: 'approved' });
        
        const formattedPostings = postings.map(p => ({
          id: p.id,
          title: p.title,
          subjects: extractSubjects(p.description),
          courses: [],
          rate: extractRate(p.description) || 0,
          status: p.status, // Use status directly from backend
          views: 0,
          messages: 0,
          createdAt: p.created_at,
        }));
        
        setAllPostings(formattedPostings);
      }
    } catch (error) {
      console.error('Failed to load postings from API, using localStorage:', error);
      // Fallback to localStorage
      const storedPostings = JSON.parse(localStorage.getItem('mockPostings') || '[]');
      const formattedPostings = storedPostings.map(p => ({
        id: p.id,
        title: p.title || p.name,
        subjects: Array.isArray(p.subjects) ? p.subjects : (p.subjects ? [p.subjects] : []),
        courses: Array.isArray(p.courses) ? p.courses : (p.course ? [p.course] : []),
        rate: p.rate || 0,
        status: p.status || "pending",
        views: 0,
        messages: storedMessages.filter(m => (m.postingId === p.id) || (m.postingId === p.id.toString())).length,
        createdAt: p.createdAt || new Date().toISOString(),
      }));
      
      if (activeTab === "my-postings") {
        setTutorPostings(formattedPostings.filter(p => p.userId === currentUser.id));
      } else if (activeTab === "my-listings") {
        setMyListings(formattedPostings.filter(p => p.userId === currentUser.id));
      } else if (activeTab === "all-postings") {
        setAllPostings(formattedPostings.filter(p => p.status === 'approved'));
      }
    } finally {
      setLoadingPostings(false);
    }
  }, [activeTab, currentUser.id, storedMessages]);
  
  useEffect(() => {
    reloadListings();
  }, [reloadListings]);
  
  // Load connection requests when connection-requests tab is active
  useEffect(() => {
    async function fetchConnectionRequests() {
      if (activeTab !== "connection-requests" || !currentUser.id) {
        return;
      }
      
      try {
        setLoadingRequests(true);
        setRequestsError(null);
        
        const [incomingResponse, sentResponse] = await Promise.all([
          getConnectionRequests('incoming'),
          getConnectionRequests('sent')
        ]);
        
        setIncomingRequests(incomingResponse.requests || []);
        setSentRequests(sentResponse.requests || []);
      } catch (err) {
        console.error('Error fetching connection requests:', err);
        setRequestsError(err.message || "Failed to load connection requests");
        setIncomingRequests([]);
        setSentRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    }
    
    fetchConnectionRequests();
  }, [activeTab, currentUser.id]);
  
  const handleAcceptRequest = async (messageId) => {
    if (!currentUser.id) return;
    
    try {
      setProcessingId(messageId);
      await acceptConnectionRequest(messageId);
      
      // Refresh requests
      const [incomingResponse, sentResponse] = await Promise.all([
        getConnectionRequests('incoming'),
        getConnectionRequests('sent')
      ]);
      
      setIncomingRequests(incomingResponse.requests || []);
      setSentRequests(sentResponse.requests || []);
    } catch (err) {
      console.error('Error accepting request:', err);
      alert(err.message || "Failed to accept request");
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleDeclineRequest = async (messageId) => {
    if (!currentUser.id) return;
    
    if (!window.confirm("Are you sure you want to decline this connection request?")) {
      return;
    }
    
    try {
      setProcessingId(messageId);
      await declineConnectionRequest(messageId);
      
      // Refresh requests
      const [incomingResponse, sentResponse] = await Promise.all([
        getConnectionRequests('incoming'),
        getConnectionRequests('sent')
      ]);
      
      setIncomingRequests(incomingResponse.requests || []);
      setSentRequests(sentResponse.requests || []);
    } catch (err) {
      console.error('Error declining request:', err);
      alert(err.message || "Failed to decline request");
    } finally {
      setProcessingId(null);
    }
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };
  
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };
  
  // Filter requests based on search query
  const filteredIncoming = incomingRequests.filter(req =>
    req.sender_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.message_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.posting_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSent = sentRequests.filter(req =>
    req.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.message_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.posting_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const currentRequests = connectionRequestsTab === "incoming" ? filteredIncoming : filteredSent;
  const pendingCount = incomingRequests.filter(r => r.connection_status === 'pending').length;
  
  // Helper function to extract rate from description
  function extractRate(description) {
    const rateMatch = description?.match(/\*\*Rate:\*\*\s*\$?([\d.]+)/);
    return rateMatch ? parseFloat(rateMatch[1]) : null;
  }
  
  // Helper function to extract subjects from description
  function extractSubjects(description) {
    const subjectsMatch = description?.match(/\*\*Subjects:\*\*\s*([^\n]+)/);
    return subjectsMatch ? subjectsMatch[1].split(',').map(s => s.trim()) : [];
  }
  
  // Messages are loaded from the backend API or localStorage fallback
  // No mock data - only show real user messages

  return (
    <div className="position-relative" style={{ minHeight: '100vh' }}>
      {/* Animated Background */}
      <div className="page-animated-bg dashboard-animated-bg">
        {/* Soft floating orbs */}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
        <div className="orb orb-5"></div>
        {/* Shimmer lines */}
        <div className="shimmer-line shimmer-line-1"></div>
        <div className="shimmer-line shimmer-line-2"></div>
        <div className="shimmer-line shimmer-line-3"></div>
        {/* Floating diamonds */}
        <div className="diamond diamond-1"></div>
        <div className="diamond diamond-2"></div>
        <div className="diamond diamond-3"></div>
        <div className="diamond diamond-4"></div>
      </div>

      <div className="container py-5">
      {/* User welcome and role indicator */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          {/* Profile Picture */}
          <div className="position-relative">
            {profilePhotoUrl && profilePhotoUrl.trim() ? (
              <>
                <img
                  src={profilePhotoUrl}
                  alt={currentUser.first_name || 'Profile'}
                  className="rounded-circle shadow-sm"
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
                  className="rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm"
                  style={{ 
                    width: "80px", 
                    height: "80px", 
                    fontSize: "32px", 
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
                  width: "80px", 
                  height: "80px", 
                  fontSize: "32px", 
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
                width: "40px", 
                height: "40px", 
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
              <i className="bi bi-camera-fill" style={{ fontSize: "18px", fontWeight: "bold", color: "#ffffff", textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}></i>
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
          <div>
            <h1>Dashboard</h1>
            <p className="text-muted mb-0">
              Welcome back, <strong>{currentUser.first_name || currentUser.firstName || currentUser.email?.split('@')[0] || 'User'}</strong>
              {canTutor && (
                <span className="badge bg-success ms-2">
                  <i className="bi bi-patch-check me-1"></i>Can Tutor
                </span>
              )}
            </p>
            {photoError && (
              <small className="text-danger d-block mt-1">{photoError}</small>
            )}
            {uploadingPhoto && (
              <small className="text-muted d-block mt-1">
                <i className="bi bi-hourglass-split me-1"></i>Uploading...
              </small>
            )}
          </div>
        </div>
        <div>
          {canTutor && (
            <Link to="/post" className="btn btn-sfsu-purple me-2">
              <i className="bi bi-plus-circle"></i> New Posting
            </Link>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="position-relative mb-4" style={{ borderBottom: '2px solid #dee2e6' }}>
        <ul className="nav nav-tabs" role="tablist">
          {/* Messages Sent (Student view) */}
          <li className="nav-item position-relative" role="presentation">
            <button
              className={`nav-link ${activeTab === "student" ? "active" : ""}`}
              onClick={() => setActiveTab("student")}
              type="button"
              role="tab"
              aria-selected={activeTab === "student"}
              aria-controls="student-tab"
              id="student-tab-btn"
            >
              <i className="bi bi-send me-1"></i> Messages Sent
            </button>
            {activeTab === "student" && (
              <motion.div
                className="dashboard-tab-indicator"
                layoutId="dashboard-tab-indicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: 0,
                  height: "3px",
                  background: "var(--sfsu-purple, #411545)",
                  width: "100%",
                  borderRadius: "2px 2px 0 0",
                }}
              />
            )}
          </li>

          {/* Rate Tutors - use past messages */}
          <li className="nav-item position-relative" role="presentation">
            <button
              className={`nav-link ${activeTab === "rate" ? "active" : ""}`}
              onClick={() => setActiveTab("rate")}
              type="button"
              role="tab"
              aria-selected={activeTab === "rate"}
              aria-controls="rate-tab"
              id="rate-tab-btn"
            >
              <i className="bi bi-star me-1"></i> Rate Tutors
            </button>
            {activeTab === "rate" && (
              <motion.div
                className="dashboard-tab-indicator"
                layoutId="dashboard-tab-indicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: 0,
                  height: "3px",
                  background: "var(--sfsu-purple, #411545)",
                  width: "100%",
                  borderRadius: "2px 2px 0 0",
                }}
              />
            )}
          </li>
          
          {/* My Listings - Available to all users */}
          <li className="nav-item position-relative" role="presentation">
            <button
              className={`nav-link ${activeTab === "my-listings" ? "active" : ""}`}
              onClick={() => setActiveTab("my-listings")}
              type="button"
              role="tab"
              aria-selected={activeTab === "my-listings"}
              aria-controls="my-listings-tab"
              id="my-listings-tab-btn"
            >
              <i className="bi bi-list-ul me-1"></i> My Listings
            </button>
            {activeTab === "my-listings" && (
              <motion.div
                className="dashboard-tab-indicator"
                layoutId="dashboard-tab-indicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: 0,
                  height: "3px",
                  background: "var(--sfsu-purple, #411545)",
                  width: "100%",
                  borderRadius: "2px 2px 0 0",
                }}
              />
            )}
          </li>
          
          {/* Profile - Available to all users */}
          <li className="nav-item position-relative" role="presentation">
            <button
              className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
              type="button"
              role="tab"
              aria-selected={activeTab === "profile"}
              aria-controls="profile-tab"
              id="profile-tab-btn"
            >
              <i className="bi bi-person-circle me-1"></i> Profile
            </button>
            {activeTab === "profile" && (
              <motion.div
                className="dashboard-tab-indicator"
                layoutId="dashboard-tab-indicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: 0,
                  height: "3px",
                  background: "var(--sfsu-purple, #411545)",
                  width: "100%",
                  borderRadius: "2px 2px 0 0",
                }}
              />
            )}
          </li>
          
          {/* Browse Tutors */}
          <li className="nav-item position-relative" role="presentation">
            <button
              className={`nav-link ${activeTab === "all-postings" ? "active" : ""}`}
              onClick={() => setActiveTab("all-postings")}
              type="button"
              role="tab"
              aria-selected={activeTab === "all-postings"}
              aria-controls="all-postings-tab"
              id="all-postings-tab-btn"
            >
              <i className="bi bi-search me-1"></i> Browse Tutors
            </button>
            {activeTab === "all-postings" && (
              <motion.div
                className="dashboard-tab-indicator"
                layoutId="dashboard-tab-indicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: 0,
                  height: "3px",
                  background: "var(--sfsu-purple, #411545)",
                  width: "100%",
                  borderRadius: "2px 2px 0 0",
                }}
              />
            )}
          </li>
          
          {/* My Postings - Additional tab for users with tutor capability */}
          {canTutor && (
            <li className="nav-item position-relative" role="presentation">
              <button
                className={`nav-link ${activeTab === "my-postings" ? "active" : ""}`}
                onClick={() => setActiveTab("my-postings")}
                type="button"
                role="tab"
                aria-selected={activeTab === "my-postings"}
                aria-controls="my-postings-tab"
                id="my-postings-tab-btn"
              >
                <i className="bi bi-person-badge me-1"></i> My Tutor Postings
              </button>
              {activeTab === "my-postings" && (
                <motion.div
                  className="dashboard-tab-indicator"
                  layoutId="dashboard-tab-indicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    left: 0,
                    height: "3px",
                    background: "var(--sfsu-purple, #411545)",
                    width: "100%",
                    borderRadius: "2px 2px 0 0",
                  }}
                />
              )}
            </li>
          )}
          
          {/* Messages Received - Additional tab for users with tutor capability */}
          {canTutor && (
            <li className="nav-item position-relative" role="presentation">
              <button
                className={`nav-link ${activeTab === "received" ? "active" : ""}`}
                onClick={() => setActiveTab("received")}
                type="button"
                role="tab"
                aria-selected={activeTab === "received"}
                aria-controls="received-tab"
                id="received-tab-btn"
              >
                <i className="bi bi-inbox me-1"></i> Messages Received
              </button>
              {activeTab === "received" && (
                <motion.div
                  className="dashboard-tab-indicator"
                  layoutId="dashboard-tab-indicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    left: 0,
                    height: "3px",
                    background: "var(--sfsu-purple, #411545)",
                    width: "100%",
                    borderRadius: "2px 2px 0 0",
                  }}
                />
              )}
            </li>
          )}
          
          {/* Connection Requests - Available to all users */}
          <li className="nav-item position-relative" role="presentation">
            <button
              className={`nav-link ${activeTab === "connection-requests" ? "active" : ""}`}
              onClick={() => setActiveTab("connection-requests")}
              type="button"
              role="tab"
              aria-selected={activeTab === "connection-requests"}
              aria-controls="connection-requests-tab"
              id="connection-requests-tab-btn"
            >
              <i className="bi bi-envelope-check me-1"></i> Connection Requests
              {pendingCount > 0 && (
                <span className="badge bg-warning ms-2" style={{ fontSize: '0.65rem' }}>
                  {pendingCount}
                </span>
              )}
            </button>
            {activeTab === "connection-requests" && (
              <motion.div
                className="dashboard-tab-indicator"
                layoutId="dashboard-tab-indicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: 0,
                  height: "3px",
                  background: "var(--sfsu-purple, #411545)",
                  width: "100%",
                  borderRadius: "2px 2px 0 0",
                }}
              />
            )}
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "student" && (
          <motion.div
            key="student-tab"
            id="student-tab"
            role="tabpanel"
            aria-labelledby="student-tab-btn"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
          >
            <div className="row g-4">
              {/* Messages */}
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header dashboard-card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">My messages</h5>
                    <Link to="/messages" className="btn btn-sm btn-outline-sfsu-purple">
                      View All
                    </Link>
                  </div>
                  <div className="card-body">
                    {storedMessages.length === 0 ? (
                      <p className="text-muted mb-0">No messages yet. Contact a tutor to send your first message!</p>
                    ) : (
                      <div className="list-group list-group-flush">
                        {storedMessages.slice().reverse().map((msg) => (
                          <div 
                            key={msg.id} 
                            className="list-group-item px-0"
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <h6 className="mb-1">
                                  {msg.postingTitle || "Tutor"}
                                </h6>
                                <p className="mb-1 text-muted">{msg.messageText}</p>
                                <div className="d-flex gap-3">
                                  <small className="text-muted">
                                    <i className="bi bi-envelope"></i> {msg.contactEmail}
                                  </small>
                                  <small className="text-muted">
                                    <i className="bi bi-clock"></i> {msg.createdAt || new Date(msg.timestamp).toLocaleString()}
                                  </small>
                                </div>
                              </div>
                              <Link 
                                to={`/postings/${msg.postingId}`}
                                className="btn btn-sm btn-outline-sfsu-purple"
                              >
                                View Posting
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Rate Tutors View */}
        {activeTab === "rate" && (
          <motion.div
            key="rate-tab"
            id="rate-tab"
            role="tabpanel"
            aria-labelledby="rate-tab-btn"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
          >
            <div className="row g-4">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header dashboard-card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Rate Tutors</h5>
                    <span className="text-muted small">
                      Based on tutors you&apos;ve contacted
                    </span>
                  </div>
                  <div className="card-body">
                    {storedMessages.length === 0 ? (
                      <p className="text-muted mb-0">
                        You haven&apos;t contacted any tutors yet. Send a message to a tutor to leave a rating afterwards.
                      </p>
                    ) : (
                      <div className="list-group list-group-flush">
                        {storedMessages.slice().reverse().map((msg) => (
                          <div key={msg.id} className="list-group-item px-0 py-3">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                              <div className="flex-grow-1">
                                <h6 className="mb-1">
                                  {msg.postingTitle || "Tutor"}
                                </h6>
                                <p className="mb-1 text-muted">
                                  {msg.messageText}
                                </p>
                                <small className="text-muted d-block mb-2">
                                  <i className="bi bi-clock me-1"></i>
                                  {msg.createdAt || new Date(msg.timestamp).toLocaleString()}
                                </small>
                              </div>
                              <div className="d-flex flex-column align-items-stretch" style={{ minWidth: "220px" }}>
                                <RatingForm
                                  postingId={msg.postingId}
                                  postingTitle={msg.postingTitle}
                                  currentUserId={currentUser.id}
                                  submittingReviewId={submittingReviewId}
                                  setSubmittingReviewId={setSubmittingReviewId}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* My Listings View - Available to all users */}
        {activeTab === "my-listings" && (
          <motion.div
            key="my-listings-tab"
            id="my-listings-tab"
            role="tabpanel"
            aria-labelledby="my-listings-tab-btn"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
          >
            <div className="row g-4">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header dashboard-card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">My Listings</h5>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-sfsu-purple"
                        onClick={() => reloadListings()}
                        title="Refresh listings"
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                      </button>
                      <Link to="/post" className="btn btn-sm btn-sfsu-purple">
                        <i className="bi bi-plus"></i> New Listing
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    {loadingMyListings ? (
                      <div className="text-center py-4">
                        <div className="spinner-border spinner-border-sm mb-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted mb-0">Loading your listings...</p>
                      </div>
                    ) : myListings.length === 0 ? (
                      <div className="text-center py-4">
                        <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
                        <p className="text-muted mt-3 mb-0">No listings yet. Create your first one!</p>
                        <Link to="/post" className="btn btn-sfsu-purple mt-3">
                          <i className="bi bi-plus-circle"></i> Create Listing
                        </Link>
                      </div>
                    ) : (
                      <div className="list-group list-group-flush">
                        {myListings.map((listing) => {
                          const statusColor = listing.status === "approved" 
                            ? "bg-success" 
                            : listing.status === "rejected" 
                            ? "bg-danger" 
                            : "bg-warning";
                          const statusText = listing.status === "approved" 
                            ? "Active" 
                            : listing.status === "rejected" 
                            ? "Rejected" 
                            : "Pending";
                          
                          return (
                            <div key={listing.id} className="list-group-item px-0 py-3">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <h6 className="mb-0">{listing.title}</h6>
                                    <span className={`badge ${statusColor}`}>
                                      {statusText}
                                    </span>
                                  </div>
                                  <p className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                                    {listing.description && listing.description.length > 150 
                                      ? `${listing.description.substring(0, 150)}...` 
                                      : listing.description}
                                  </p>
                                  <div className="d-flex gap-3 flex-wrap">
                                    {listing.subjects && listing.subjects.length > 0 && (
                                      <small className="text-muted">
                                        <i className="bi bi-book me-1"></i>
                                        {listing.subjects.join(", ")}
                                      </small>
                                    )}
                                    {listing.createdAt && (
                                      <small className="text-muted">
                                        <i className="bi bi-calendar me-1"></i>
                                        Created {new Date(listing.createdAt).toLocaleDateString()}
                                      </small>
                                    )}
                                    {listing.messages > 0 && (
                                      <small className="text-muted">
                                        <i className="bi bi-envelope me-1"></i>
                                        {listing.messages} message{listing.messages !== 1 ? 's' : ''}
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 d-flex gap-2">
                                <Link
                                  to={`/postings/${listing.id}`}
                                  className="btn btn-sm btn-outline-sfsu-purple"
                                >
                                  <i className="bi bi-eye me-1"></i> View
                                </Link>
                                {listing.status === "pending" && (
                                  <span className="btn btn-sm btn-outline-secondary" style={{ cursor: 'default' }}>
                                    <i className="bi bi-clock me-1"></i> Awaiting Approval
                                  </span>
                                )}
                                {listing.status === "approved" && (
                                  <span className="badge bg-success align-self-center">
                                    <i className="bi bi-check-circle me-1"></i> Active
                                  </span>
                                )}
                                {listing.status === "rejected" && (
                                  <span className="badge bg-danger align-self-center">
                                    <i className="bi bi-x-circle me-1"></i> Rejected
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile Tab - Redirect to Profile page */}
        {activeTab === "profile" && (
          <motion.div
            key="profile-tab"
            id="profile-tab"
            role="tabpanel"
            aria-labelledby="profile-tab-btn"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
          >
            <div className="text-center py-5">
              <i className="bi bi-person-circle" style={{ fontSize: '4rem', color: '#411545', marginBottom: '1rem' }}></i>
              <h4 className="mb-3">Edit Your Profile</h4>
              <p className="text-muted mb-4">
                Update your profile information including major, bio, experience, and tutoring preferences.
              </p>
              <button
                className="btn btn-sfsu-purple"
                onClick={() => navigate("/profile")}
              >
                <i className="bi bi-pencil-square me-2"></i>Go to Profile Page
              </button>
            </div>
          </motion.div>
        )}

        {/* All Postings View */}
        {activeTab === "all-postings" && (
          <motion.div
            key="all-postings-tab"
            id="all-postings-tab"
            role="tabpanel"
            aria-labelledby="all-postings-tab-btn"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
          >
            <div className="row g-4">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header dashboard-card-header">
                    <h5 className="mb-0">All approved postings</h5>
                  </div>
                  <div className="card-body">
                    {loadingPostings ? (
                      <p className="text-muted mb-0">Loading postings...</p>
                    ) : allPostings.length === 0 ? (
                      <p className="text-muted mb-0">No postings available yet.</p>
                    ) : (
                      <div className="list-group list-group-flush">
                        {allPostings.map((posting) => (
                          <div key={posting.id} className="list-group-item px-0">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                  <h6 className="mb-0">{posting.title}</h6>
                                  <span className="badge bg-success">approved</span>
                                </div>
                                <p className="mb-1 text-muted">
                                  {posting.subjects.length > 0 && `${posting.subjects.join(", ")} • `}
                                  ${posting.rate}/hr
                                </p>
                                {posting.createdAt && (
                                  <small className="text-muted">
                                    <i className="bi bi-calendar"></i> {new Date(posting.createdAt).toLocaleDateString()}
                                  </small>
                                )}
                              </div>
                            </div>
                            <div className="mt-2">
                              <Link
                                to={`/postings/${posting.id}`}
                                className="btn btn-sm btn-outline-sfsu-purple"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* My Postings View */}
        {activeTab === "my-postings" && (
          <motion.div
            key="my-postings-tab"
            id="my-postings-tab"
            role="tabpanel"
            aria-labelledby="my-postings-tab-btn"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
          >
            <div className="row g-4">
              {/* My Postings */}
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header dashboard-card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">My postings</h5>
                    <Link to="/post" className="btn btn-sm btn-sfsu-purple">
                      <i className="bi bi-plus"></i> New
                    </Link>
                  </div>
                  <div className="card-body">
                    {tutorPostings.length === 0 ? (
                      <p className="text-muted mb-0">No postings yet. Create your first one!</p>
                    ) : (
                      <div className="list-group list-group-flush">
                        {tutorPostings.map((posting) => {
                          const postingMessages = storedMessages.filter(m => 
                            (m.postingId === posting.id) || (m.postingId === posting.id.toString())
                          );
                          return (
                            <div key={posting.id} className="list-group-item px-0">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center gap-2 mb-1">
                                    <h6 className="mb-0">{posting.title}</h6>
                                    <span className={`badge ${posting.status === "approved" ? "bg-success" : "bg-warning"}`}>
                                      {posting.status || "pending"}
                                    </span>
                                  </div>
                                  <p className="mb-1 text-muted">
                                    {posting.subjects.join(", ")} • ${posting.rate}/hr
                                  </p>
                                  <small className="text-muted">
                                    <i className="bi bi-envelope"></i> {postingMessages.length} message{postingMessages.length !== 1 ? 's' : ''}
                                    {posting.createdAt && (
                                      <>{" • "}<i className="bi bi-calendar"></i> {new Date(posting.createdAt).toLocaleDateString()}</>
                                    )}
                                  </small>
                                </div>
                              </div>
                              <div className="mt-2">
                                <Link
                                  to={`/post?id=${posting.id}`}
                                  className="btn btn-sm btn-outline-sfsu-purple me-2"
                                >
                                  Edit
                                </Link>
                                <Link
                                  to={`/postings/${posting.id}`}
                                  className="btn btn-sm btn-outline-sfsu-gold"
                                >
                                  View
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Messages Received Tab - For Tutors */}
        {activeTab === "received" && canTutor && (
          <motion.div
            key="received-tab"
            id="received-tab"
            role="tabpanel"
            aria-labelledby="received-tab-btn"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
          >
            <div className="row g-4">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header dashboard-card-header">
                    <h5 className="mb-0">
                      <i className="bi bi-inbox me-2"></i>
                      Messages from Students
                    </h5>
                  </div>
                  <div className="card-body">
                    {storedMessages.filter(m => {
                      // Filter messages where current user is the recipient (tutor)
                      return m.recipientUserId === currentUser.id || 
                             m.recipientId === currentUser.id;
                    }).length === 0 ? (
                      <div className="text-center py-4">
                        <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
                        <p className="text-muted mt-3 mb-0">
                          No messages received yet. Students will reach out when they're interested in your tutoring services.
                        </p>
                      </div>
                    ) : (
                      <div className="list-group list-group-flush">
                        {storedMessages
                          .filter(m => m.recipientUserId === currentUser.id || m.recipientId === currentUser.id)
                          .slice()
                          .reverse()
                          .map((msg) => (
                            <div key={msg.id} className="list-group-item px-0">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <h6 className="mb-1">
                                    <i className="bi bi-person me-1"></i>
                                    From: {msg.contactEmail || msg.senderEmail || "Student"}
                                  </h6>
                                  <p className="mb-1 text-muted">{msg.messageText}</p>
                                  <div className="d-flex gap-3">
                                    <small className="text-muted">
                                      <i className="bi bi-file-text me-1"></i>
                                      Re: {msg.postingTitle || "Your posting"}
                                    </small>
                                    <small className="text-muted">
                                      <i className="bi bi-clock me-1"></i>
                                      {msg.createdAt || msg.sentAt || new Date(msg.timestamp).toLocaleString()}
                                    </small>
                                  </div>
                                </div>
                                <Link 
                                  to={`/postings/${msg.postingId}`}
                                  className="btn btn-sm btn-outline-sfsu-purple"
                                >
                                  View Posting
                                </Link>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Connection Requests Tab */}
        {activeTab === "connection-requests" && (
          <motion.div
            key="connection-requests-tab"
            id="connection-requests-tab"
            role="tabpanel"
            aria-labelledby="connection-requests-tab-btn"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
          >
            <div className="row g-4">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header dashboard-card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Connection Requests</h5>
                    {pendingCount > 0 && (
                      <span className="badge bg-warning">
                        {pendingCount} pending
                      </span>
                    )}
                  </div>
                  <div className="card-body">
                    <p className="text-muted small mb-3">
                      One-round requests: Accept/decline, then connect outside the app.
                    </p>
                    
                    {/* Tabs */}
                    <ul className="nav nav-tabs mb-3" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${connectionRequestsTab === "incoming" ? "active" : ""}`}
                          onClick={() => setConnectionRequestsTab("incoming")}
                          style={{
                            color: connectionRequestsTab === "incoming" ? '#411545' : '#6b6b6b',
                            backgroundColor: connectionRequestsTab === "incoming" ? 'transparent' : 'transparent',
                            borderBottom: connectionRequestsTab === "incoming" ? '2px solid #411545' : 'none',
                            fontWeight: connectionRequestsTab === "incoming" ? '600' : 'normal'
                          }}
                        >
                          Incoming
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${connectionRequestsTab === "sent" ? "active" : ""}`}
                          onClick={() => setConnectionRequestsTab("sent")}
                          style={{
                            color: connectionRequestsTab === "sent" ? '#411545' : '#6b6b6b',
                            backgroundColor: connectionRequestsTab === "sent" ? 'transparent' : 'transparent',
                            borderBottom: connectionRequestsTab === "sent" ? '2px solid #411545' : 'none',
                            fontWeight: connectionRequestsTab === "sent" ? '600' : 'normal'
                          }}
                        >
                          Sent
                        </button>
                      </li>
                    </ul>
                    
                    {/* Search */}
                    <div className="input-group mb-3">
                      <span className="input-group-text" style={{ backgroundColor: '#f5f5f5', border: '1px solid #dee2e6' }}>
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search requests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: '1px solid #dee2e6' }}
                      />
                    </div>
                    
                    {/* Requests List */}
                    {loadingRequests ? (
                      <div className="text-center py-4">
                        <div className="spinner-border spinner-border-sm mb-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted mb-0">Loading requests...</p>
                      </div>
                    ) : requestsError ? (
                      <div className="text-center py-4 text-danger">
                        <i className="bi bi-exclamation-triangle fs-1 d-block mb-2"></i>
                        <p>{requestsError}</p>
                      </div>
                    ) : currentRequests.length === 0 ? (
                      <div className="text-center py-4 text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                        <p>No {connectionRequestsTab} requests found</p>
                      </div>
                    ) : (
                      <div className="list-group list-group-flush">
                        {currentRequests.map((request) => {
                          const isPending = request.connection_status === 'pending';
                          const isAccepted = request.connection_status === 'accepted';
                          const isDeclined = request.connection_status === 'declined';
                          const displayName = connectionRequestsTab === "incoming" ? request.sender_name : request.recipient_name;
                          const displayEmail = connectionRequestsTab === "incoming" ? request.sender_email : request.recipient_email;
                          
                          return (
                            <div
                              key={request.id}
                              className="list-group-item px-0 py-3"
                            >
                              <div className="d-flex align-items-start mb-2">
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3"
                                  style={{
                                    width: "48px",
                                    height: "48px",
                                    fontSize: "16px",
                                    backgroundColor: '#411545',
                                    color: '#ffffff',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {getInitials(displayName)}
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start mb-1">
                                    <div>
                                      <h6 className="mb-0" style={{ color: '#411545' }}>
                                        {displayName}
                                      </h6>
                                      <small className="text-muted d-block">
                                        {displayEmail}
                                      </small>
                                    </div>
                                    <div className="text-end">
                                      {isPending && (
                                        <span className="badge bg-warning">
                                          Pending
                                        </span>
                                      )}
                                      {isAccepted && (
                                        <span className="badge bg-success">Accepted</span>
                                      )}
                                      {isDeclined && (
                                        <span className="badge bg-secondary">Declined</span>
                                      )}
                                      <small className="d-block text-muted mt-1">
                                        {formatTimestamp(request.sent_at)}
                                      </small>
                                    </div>
                                  </div>
                                  
                                  <p className="mb-2" style={{ color: '#2c2c2c' }}>
                                    {request.message_text}
                                  </p>
                                  
                                  {request.contact_info && (
                                    <p className="mb-2 small text-muted">
                                      <i className="bi bi-envelope me-1"></i>
                                      {request.contact_info}
                                    </p>
                                  )}
                                  
                                  {connectionRequestsTab === "incoming" && isPending && (
                                    <div className="d-flex gap-2 mt-3">
                                      <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleAcceptRequest(request.id)}
                                        disabled={processingId === request.id}
                                      >
                                        <i className="bi bi-check"></i> Accept
                                      </button>
                                      <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => handleDeclineRequest(request.id)}
                                        disabled={processingId === request.id}
                                      >
                                        <i className="bi bi-x"></i> Decline
                                      </button>
                                    </div>
                                  )}
                                  
                                  {request.posting_title && (
                                    <Link
                                      to={`/postings/${request.posting_id}`}
                                      className="btn btn-link p-0 text-decoration-none mt-2"
                                      style={{ color: '#411545', fontSize: '0.875rem' }}
                                    >
                                      View Posting
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

