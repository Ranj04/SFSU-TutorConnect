/**
 * SearchBar.jsx
 * -------------
 * A unified search bar component that works in two modes: "hero" (large, for the
 * landing page) and "compact" (for the navbar). Includes a subject dropdown and
 * search input. The dropdown renders via a React Portal so it always appears
 * above other content.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { getCategories } from "../services/api";

/**
 * SearchBar Component
 * @param {Object} props
 * @param {"hero" | "compact" | "navbar"} props.variant - Visual variant: "hero" for landing, "compact" for small navbar, "navbar" for large navbar
 * @param {Function} props.onSearch - Optional callback when search is submitted (if not provided, navigates to /search)
 * @param {string} props.initialQuery - Initial search query value
 * @param {string} props.initialCategory - Initial category selection
 */
export default function SearchBar({ 
  variant = "hero", 
  onSearch,
  initialQuery = "",
  initialCategory = ""
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Core search state
  const [q, setQ] = useState(initialQuery);
  const [selected, setSelected] = useState(initialCategory ? [initialCategory] : []);
  const [open, setOpen] = useState(false);
  const [queryError, setQueryError] = useState("");
  const ddRef = useRef(null);
  const formRef = useRef(null);

  // Categories from API
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        setCategoriesLoading(true);
        const data = await getCategories();
        setCategories(data.categories || []);
        setCategoriesError(null);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategoriesError(err.message);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Sync with URL params (for hero variant on Home page)
  useEffect(() => {
    if (variant === "hero") {
      const params = new URLSearchParams(location.search);
      const qParam = params.get("q");
      const categoryParam = params.get("category");

      if (qParam !== null) setQ(qParam);
      if (categoryParam !== null && categoryParam.length > 0) {
        setSelected([categoryParam]);
      }
    }
  }, [location.search, variant]);

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    function onDoc(e) {
      if (!ddRef.current) return;
      // Check if click is outside the dropdown button and menu
      const menu = document.querySelector('.search-unified-dropdown-menu');
      if (!ddRef.current.contains(e.target) && 
          (!menu || !menu.contains(e.target))) {
        setOpen(false);
      }
    }
    
    function onScroll() {
      if (open) updateDropdownPosition();
    }
    
    function onResize() {
      if (open) updateDropdownPosition();
    }
    
    document.addEventListener("click", onDoc);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    
    return () => {
      document.removeEventListener("click", onDoc);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // Validate search query: max 40 chars, alphanumeric + spaces only
  function validateQuery(query) {
    if (!query || !query.trim()) {
      return { valid: true, error: "" };
    }
    
    const trimmed = query.trim();
    
    // Check length
    if (trimmed.length > 40) {
      return { valid: false, error: "Search query must be 40 characters or less" };
    }
    
    // Check alphanumeric + spaces only
    const alphanumericSpacePattern = /^[A-Za-z0-9\s]+$/;
    if (!alphanumericSpacePattern.test(trimmed)) {
      return { valid: false, error: "Search query can only contain letters, numbers, and spaces" };
    }
    
    return { valid: true, error: "" };
  }

  function toggle(categorySlug) {
    setSelected(prev => 
      prev.includes(categorySlug) 
        ? prev.filter(c => c !== categorySlug) 
        : [categorySlug]
    );
  }

  // Calculate dropdown position when opening (for fixed positioning via portal)
  const updateDropdownPosition = () => {
    if (ddRef.current) {
      const rect = ddRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
  };

  useEffect(() => {
    if (open) {
      updateDropdownPosition();
    }
  }, [open]);

  function submit(e) {
    e.preventDefault();
    
    // Validate query
    const validation = validateQuery(q);
    if (!validation.valid) {
      setQueryError(validation.error);
      return;
    }
    
    setQueryError("");
    
    const params = new URLSearchParams();
    const trimmedQuery = q ? q.trim() : "";
    if (trimmedQuery) params.set("q", trimmedQuery);
    if (selected.length > 0) params.set("category", selected[0]);

    if (onSearch) {
      onSearch({ q: trimmedQuery, category: selected[0] || null });
    } else {
      navigate(`/search?${params.toString()}`);
    }
    
    // Close dropdown after submit
    setOpen(false);
  }

  const isCompact = variant === "compact";
  const isNavbar = variant === "navbar";

  // Get display text for selected category
  const selectedCategoryName = selected.length > 0 
    ? categories.find(c => c.slug === selected[0])?.name || "Subject"
    : null;

  // Determine CSS classes based on variant
  const formClass = isNavbar 
    ? 'search-bar-unified search-bar-navbar' 
    : isCompact 
      ? 'search-bar-unified search-bar-compact' 
      : 'search-bar-unified search-bar-hero';
  
  const controlClass = isNavbar
    ? 'search-unified-control search-unified-navbar'
    : isCompact 
      ? 'search-unified-control search-unified-compact' 
      : 'search-unified-control';

  return (
    <form 
      ref={formRef}
      className={formClass}
      onSubmit={submit} 
      role="search" 
      aria-label="Search tutors"
    >
      <div className={controlClass}>
        {/* Subject dropdown - positioned on left */}
        <div className="search-unified-dropdown" ref={ddRef}>
          <button
            type="button"
            className={`search-unified-subject-btn ${isCompact ? 'search-unified-subject-btn-compact' : ''}`}
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-haspopup="listbox"
            disabled={categoriesLoading}
          >
            <span className="search-subject-text">
              {categoriesLoading 
                ? "..." 
                : selectedCategoryName || (isCompact ? "All" : "All Subjects")}
            </span>
            <svg 
              className="search-dropdown-caret" 
              width="10" 
              height="6" 
              viewBox="0 0 10 6" 
              fill="none"
              aria-hidden="true"
            >
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dropdown menu rendered via Portal to document.body for proper z-index */}
          {ReactDOM.createPortal(
            <AnimatePresence>
              {open && (
                <motion.div 
                  className="search-unified-dropdown-menu" 
                  role="listbox" 
                  aria-label="Select Subject"
                  style={{
                    position: 'fixed',
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`,
                  }}
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                <div className="search-dropdown-list">
                  {categoriesError && (
                    <div className="search-dropdown-error">
                      Error loading. Please try again.
                    </div>
                  )}
                  {!categoriesError && categories.length === 0 && !categoriesLoading && (
                    <div className="search-dropdown-empty">
                      No subjects available
                    </div>
                  )}
                  {/* All option */}
                  <label className="search-dropdown-item">
                    <input
                      type="radio"
                      name="search-category"
                      checked={selected.length === 0}
                      onChange={() => setSelected([])}
                      aria-checked={selected.length === 0}
                    />
                    <span>All Subjects</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat.slug} className="search-dropdown-item">
                      <input
                        type="radio"
                        name="search-category"
                        checked={selected.includes(cat.slug)}
                        onChange={() => toggle(cat.slug)}
                        aria-checked={selected.includes(cat.slug)}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
                <div className="search-dropdown-actions">
                  <button 
                    type="button" 
                    className="search-dropdown-clear" 
                    onClick={() => { setSelected([]); setOpen(false); }}
                  >
                    Clear
                  </button>
                  <button 
                    type="button" 
                    className="search-dropdown-done" 
                    onClick={() => setOpen(false)}
                  >
                    Done
                  </button>
                </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
        </div>

        {/* Divider */}
        <div className="search-unified-divider" aria-hidden="true"></div>

        {/* Search input */}
        <div className="search-unified-input-wrap">
          <input
            type="text"
            className={`search-unified-input ${isCompact ? 'search-unified-input-compact' : ''} ${queryError ? 'is-invalid' : ''}`}
            placeholder={isCompact ? "Search tutors, courses..." : "Search courses, tutors, or subjects..."}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              // Clear error when user types
              if (queryError) {
                const validation = validateQuery(e.target.value);
                if (validation.valid) {
                  setQueryError("");
                }
              }
            }}
            maxLength={40}
            aria-label="Search query"
            aria-describedby={queryError ? "searchQueryError" : undefined}
            aria-invalid={!!queryError}
          />
          {queryError && (
            <div id="searchQueryError" className="invalid-feedback" style={{ position: 'absolute', bottom: '-20px', left: '0', fontSize: '0.875rem' }}>
              {queryError}
            </div>
          )}
        </div>

        {/* Search button */}
        <button 
          type="submit" 
          className={`search-unified-btn ${isCompact ? 'search-unified-btn-compact' : ''}`}
          aria-label="Search"
        >
          {isCompact ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            "Search"
          )}
        </button>
      </div>
    </form>
  );
}

