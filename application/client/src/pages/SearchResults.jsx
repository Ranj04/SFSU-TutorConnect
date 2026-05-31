/**
 * SearchResults.jsx
 * -----------------
 * Displays search results for tutors based on the user's query and selected
 * subject filter. Fetches approved postings from the backend and shows them
 * in a grid layout with pagination.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { getApprovedPostings } from "../services/postingsService";
import SkeletonCard from "../components/SkeletonCard";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// Validate search query: max 40 chars, alphanumeric + spaces only
function validateSearchQuery(query) {
  if (!query || !query.trim()) {
    return { valid: true, error: "" };
  }
  
  const trimmed = query.trim();
  
  if (trimmed.length > 40) {
    return { valid: false, error: "Search query must be 40 characters or less" };
  }
  
  const alphanumericSpacePattern = /^[A-Za-z0-9\s]+$/;
  if (!alphanumericSpacePattern.test(trimmed)) {
    return { valid: false, error: "Search query can only contain letters, numbers, and spaces" };
  }
  
  return { valid: true, error: "" };
}

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // State management - initialize from URL params to avoid double fetch
  const initialCategory = searchParams.get("category") || "";
  let initialQuery = searchParams.get("q") || "";
  
  // Validate initial query from URL params (defensive validation)
  const queryValidation = validateSearchQuery(initialQuery);
  if (!queryValidation.valid) {
    // Sanitize invalid query
    initialQuery = "";
  }
  
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = parseInt(searchParams.get("limit")) || 10;
  
  // API-backed results plus UI state for filters, pagination, and loading UX
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("best-match"); // "best-match" | "price-low" | "price-high"

  // Update state when URL params change (only after initial mount)
  useEffect(() => {
    let q = searchParams.get("q") || "";
    
    // Validate and sanitize query from URL
    const validation = validateSearchQuery(q);
    if (!validation.valid) {
      q = ""; // Clear invalid query
      // Update URL to remove invalid query
      const params = new URLSearchParams(searchParams);
      params.delete("q");
      navigate(`/search?${params.toString()}`, { replace: true });
    }
    
    const category = searchParams.get("category") || "";
    const p = parseInt(searchParams.get("page")) || 1;
    const lim = parseInt(searchParams.get("limit")) || 10;
    
    setSearchQuery(q);
    setSelectedCategory(category);
    setPage(p);
    setLimit(lim);
  }, [searchParams, navigate]);

  // Fetch tutors when search params change
  useEffect(() => {
    async function fetchTutors() {
      setLoading(true);
      setError(null);
      
      // Validate query before fetching
      const validation = validateSearchQuery(searchQuery);
      if (!validation.valid) {
        setError(validation.error);
        setTutors([]);
        setTotal(0);
        setLoading(false);
        return;
      }
      
      try {
        const data = await getApprovedPostings({
          category: selectedCategory || "All",
          q: searchQuery || "",
          page,
          limit,
        });
        
        let tutorsList = data.results || [];
        
        // Sort tutors
        if (sortBy === "price-low") {
          tutorsList.sort((a, b) => {
            const rateA = parseFloat(a.rate || a.hourly_rate || 0);
            const rateB = parseFloat(b.rate || b.hourly_rate || 0);
            return rateA - rateB;
          });
        } else if (sortBy === "price-high") {
          tutorsList.sort((a, b) => {
            const rateA = parseFloat(a.rate || a.hourly_rate || 0);
            const rateB = parseFloat(b.rate || b.hourly_rate || 0);
            return rateB - rateA;
          });
        }
        // "best-match" keeps API order (or default order)
        
        setTutors(tutorsList);
        setTotal(data.total || 0);
      } catch (err) {
        console.error("Search failed:", err);
        setError(err.message || "Failed to fetch tutors. Please try again.");
        setTutors([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    fetchTutors();
  }, [selectedCategory, searchQuery, page, limit, sortBy]);

  // Handle page navigation
  function handlePageChange(newPage) {
    const params = new URLSearchParams();
    if (searchQuery && searchQuery.trim()) params.set("q", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    params.set("page", newPage.toString());
    params.set("limit", limit.toString());
    navigate(`/search?${params.toString()}`, { replace: true });
  }

  // Calculate pagination info
  const totalPages = Math.ceil(total / limit);
  const startResult = total > 0 ? (page - 1) * limit + 1 : 0;
  const endResult = Math.min(page * limit, total);

  return (
    <div className="container py-5">
      {/* Search Header */}
      <div className="mb-4 text-center">
        <h1 className="mb-3">Find My Tutor</h1>
        {/* Divider under title */}
        <div className="search-results-divider mb-4 mx-auto" style={{ maxWidth: "320px" }}></div>

        {/* Sort and Results Count */}
        <motion.div 
          className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Sort Dropdown */}
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="sortSelect" className="form-label mb-0">Sort by:</label>
            <select
              id="sortSelect"
              className="form-select"
              style={{ width: 'auto', minWidth: '180px' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="best-match">Best Match</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {!loading && (
            <p className="text-muted mb-0">
              Showing {startResult}-{endResult} of {total} tutor{total !== 1 ? "s" : ""}
            </p>
          )}
        </motion.div>
      </div>

      {/* Loading State with Skeletons */}
      {loading && (
        <div className="row g-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="col-md-6 col-lg-4">
              <SkeletonCard />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">⚠️ Backend Connection Error</h4>
          <p>{error}</p>
          <hr />
          <div className="mb-0">
            <p><strong>Troubleshooting Steps:</strong></p>
            <ol className="mb-2">
              <li>Make sure the backend server is running at <code>http://localhost:8000</code></li>
              <li>Check if MySQL database is running and configured</li>
              <li>Verify database credentials in <code>backend/app/config.py</code></li>
              <li>Run migrations and seed data if needed</li>
            </ol>
            <p className="small text-muted">
              <strong>Quick Test:</strong> Open <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">http://localhost:8000/docs</a> to check API status
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {!loading && !error && (
          <motion.div 
            className="row g-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tutors.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-info" role="alert">
                  <h4 className="alert-heading">No tutors found</h4>
                  <p>Try adjusting your search criteria or browse all tutors.</p>
                </div>
              </div>
            ) : (
              tutors.map((tutor, idx) => (
                <motion.div 
                  key={tutor.id} 
                  className="col-md-6 col-lg-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: prefersReducedMotion ? 0.01 : 0.3,
                    delay: prefersReducedMotion ? 0 : idx * 0.05 
                  }}
                >
                  <motion.div 
                    className="card h-100 shadow-sm tutor-card"
                    whileHover={prefersReducedMotion ? {} : { y: -2, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Tutor Avatar */}
                    <div className="card-body d-flex flex-column">
                      <div 
                        className="cursor-pointer"
                        onClick={() => navigate(`/postings/${tutor.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="text-center mb-3">
                          {tutor.profilePhotoUrl && tutor.profilePhotoUrl.trim() ? (
                            <>
                              <img
                                src={tutor.profilePhotoUrl}
                                alt={tutor.name || 'Tutor'}
                                className="rounded-circle mx-auto mb-2 shadow-sm"
                                style={{ 
                                  width: "60px", 
                                  height: "60px", 
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
                                className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm"
                                style={{ 
                                  width: "60px", 
                                  height: "60px",
                                  backgroundColor: "#411545", 
                                  fontSize: "24px", 
                                  fontWeight: "600",
                                  display: 'none'
                                }}
                              >
                                {tutor.name ? tutor.name.split(' ').map(n => n[0]).join('') : '?'}
                              </div>
                            </>
                          ) : (
                            <div 
                              className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm"
                              style={{ 
                                width: "60px", 
                                height: "60px",
                                backgroundColor: "#411545", 
                                fontSize: "24px", 
                                fontWeight: "600"
                              }}
                            >
                              {tutor.name ? tutor.name.split(' ').map(n => n[0]).join('') : '?'}
                            </div>
                          )}
                          <h5 className="card-title mb-1">
                            {tutor.title || tutor.name}
                          </h5>
                          {/* Rating */}
                          {(tutor.rating || tutor.reviewCount) && (
                            <p className="mb-1 small text-muted">
                              <i className="bi bi-star-fill text-warning me-1"></i>
                              {tutor.rating ? tutor.rating.toFixed(1) : "New"}
                              {tutor.reviewCount > 0 && (
                                <>
                                  {" "}
                                  · {tutor.reviewCount} review
                                  {tutor.reviewCount !== 1 ? "s" : ""}
                                </>
                              )}
                            </p>
                          )}
                          {tutor.rate && (
                            <p className="mb-2" style={{ fontWeight: '600', color: '#411545' }}>
                              ${tutor.rate}/hour
                            </p>
                          )}
                        </div>

                        {/* Bio */}
                        {tutor.bio && (
                          <p className="card-text text-muted small mb-3">
                            {tutor.bio.length > 150 
                              ? `${tutor.bio.substring(0, 150)}...` 
                              : tutor.bio}
                          </p>
                        )}

                        {/* Subjects */}
                        {tutor.subjects && tutor.subjects.length > 0 && (
                          <div className="mb-3 text-center">
                            <h6 className="small text-muted mb-2">Subjects:</h6>
                            <div className="d-flex flex-wrap gap-1 justify-content-center">
                              {tutor.subjects.map((subject, idx) => (
                                <span 
                                  key={idx} 
                                  className="badge bg-primary bg-opacity-10 text-primary"
                                >
                                  {subject}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Courses */}
                        {tutor.courses && tutor.courses.length > 0 && (
                          <div className="mb-3 text-center">
                            <h6 className="small text-muted mb-2">Courses:</h6>
                            <div className="d-flex flex-wrap gap-1 justify-content-center">
                              {tutor.courses.slice(0, 5).map((course, idx) => (
                                <span 
                                  key={idx} 
                                  className="badge bg-secondary"
                                >
                                  {course}
                                </span>
                              ))}
                              {tutor.courses.length > 5 && (
                                <span className="badge bg-light text-dark">
                                  +{tutor.courses.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-auto pt-3 border-top d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm flex-grow-1"
                          onClick={() => navigate(`/postings/${tutor.id}`)}
                        >
                          More Info
                        </button>
                        <button
                          className="btn btn-primary btn-sm flex-grow-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            const postingTitle = tutor.title || tutor.name || "Tutor";
                            const recipientUserId = tutor.userId;
                            navigate(
                              `/contact-tutor?postingId=${tutor.id}` +
                              `&postingTitle=${encodeURIComponent(postingTitle)}` +
                              (recipientUserId ? `&recipientUserId=${recipientUserId}` : "")
                            );
                          }}
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination Controls */}
      {!loading && !error && total > 0 && totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
          <button 
            className="btn btn-outline-primary"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            ← Previous
          </button>
          <span className="text-muted">
            Page {page} of {totalPages}
          </span>
          <button 
            className="btn btn-outline-primary"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {/* Back to Home */}
      <div className="text-center mt-5">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}


