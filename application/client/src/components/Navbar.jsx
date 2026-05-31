/**
 * Navbar.jsx
 * ----------
 * The main navigation bar that appears on every page. Includes the logo,
 * search bar, navigation links, and sign in button. Highlights the active
 * page and collapses into a hamburger menu on mobile.
 *
 * Contributors: Ranjiv Jithendran, Adea Mulaku, Dhvanil Bhagat
 */
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownButtonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated") === "true";
      const userData = localStorage.getItem("user");
      setIsAuthenticated(authStatus);
      if (authStatus && userData) {
        try {
          setCurrentUser(JSON.parse(userData));
        } catch (e) {
          console.error("Failed to parse user data:", e);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    checkAuth();
    // Listen for storage changes (useful for multi-tab sync)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]); // Re-check on location change

  // Handle scroll for shadow/compact effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close navbar on window resize (helps with responsive behavior)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setNavbarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate dropdown position when menu opens or window changes
  useEffect(() => {
    const updatePosition = () => {
      if (showUserMenu && dropdownButtonRef.current) {
        const buttonRect = dropdownButtonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: buttonRect.bottom + 4,
          right: window.innerWidth - buttonRect.right
        });
      }
    };

    if (showUserMenu) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showUserMenu]);

  // Close navbar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarOpen && window.innerWidth < 992) {
        const nav = document.querySelector('.navbar');
        if (nav && !nav.contains(event.target)) {
          setNavbarOpen(false);
        }
      }
    };

    if (navbarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navbarOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      className={`navbar navbar-expand-lg custom-navbar border-bottom ${isScrolled ? 'navbar-scrolled' : ''}`}
      style={{ backgroundColor: '#411545' }}
      initial={false}
      animate={{
        boxShadow: isScrolled ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
        paddingTop: isScrolled ? '0.4rem' : '0.5rem',
        paddingBottom: isScrolled ? '0.4rem' : '0.5rem',
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="container-fluid navbar-container-wide">
        <div className="navbar-layout-wide">
          {/* Left: Brand (icon + title + small meta under it) */}
          <div className="navbar-left">
            <Link to="/" className="navbar-brand d-flex align-items-center p-0">
              <div className="brand-icon d-flex align-items-center justify-content-center flex-shrink-0 me-2" style={{ background: 'transparent' }}>
                <img 
                  src="/assets/sfsu_logo.png" 
                  alt="SFSU Logo" 
                  style={{ 
                    height: '40px', 
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div className="d-flex flex-column">
                <span className="brand-title fw-bold text-white">Tutor Connect</span>
                <small className="brand-meta text-white" style={{ opacity: 0.8, fontSize: '60%' }}>CSC 648 • Fall 2025 • Team 02</small>
              </div>
            </Link>
          </div>

          {/* Center: Large Search Bar (visible on all pages) */}
          <div className="navbar-center-wide d-none d-lg-flex">
            <SearchBar variant="navbar" />
          </div>

          {/* Collapse button for small screens */}
          <button
            className="navbar-toggler ms-auto d-lg-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
            aria-controls="navbarMain"
            aria-expanded={navbarOpen}
            aria-label="Toggle navigation"
            style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}
          >
            <span className="navbar-toggler-icon" style={{ 
              backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 0.85)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")" 
            }} />
          </button>

          {/* Right: Navigation links and actions (smaller buttons) */}
          <div className={`navbar-right-compact d-none d-lg-flex`} id="navbarMain">
            <ul className="navbar-links-compact">
              <li className="nav-item">
                <Link 
                  className={`nav-link text-white nav-link-sm ${isActive('/become-tutor') ? 'active' : ''}`}
                  to="/become-tutor" 
                  onClick={() => setNavbarOpen(false)}
                >
                  Become a Tutor
                  {isActive('/become-tutor') && (
                    <motion.div 
                      className="nav-link-underline"
                      layoutId="navbar-underline"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link text-white nav-link-sm ${isActive('/dashboard') ? 'active' : ''}`}
                  to="/dashboard" 
                  onClick={() => setNavbarOpen(false)}
                >
                  Dashboard
                  {isActive('/dashboard') && (
                    <motion.div 
                      className="nav-link-underline"
                      layoutId="navbar-underline"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link text-white nav-link-sm ${isActive('/about') ? 'active' : ''}`}
                  to="/about" 
                  onClick={() => setNavbarOpen(false)}
                >
                  About Us
                  {isActive('/about') && (
                    <motion.div 
                      className="nav-link-underline"
                      layoutId="navbar-underline"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            </ul>
            <div className="d-flex align-items-center ms-lg-1">
              {isAuthenticated && currentUser ? (
                <>
                  {/* Invisible overlay to close dropdown when clicking outside */}
                  {showUserMenu && (
                    <div 
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999998,
                        backgroundColor: 'transparent'
                      }}
                      onClick={() => setShowUserMenu(false)}
                    />
                  )}
                  <div className="dropdown position-relative" style={{ zIndex: 999999 }}>
                    <button 
                      ref={dropdownButtonRef}
                      className="btn btn-light btn-sm-nav dropdown-toggle" 
                      type="button" 
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      style={{ position: 'relative', zIndex: 999999 }}
                    >
                      {currentUser.first_name || 'User'} {currentUser.last_name || ''}
                    </button>
                    {showUserMenu && (
                      <ul 
                        className="dropdown-menu dropdown-menu-end show" 
                        style={{ 
                          position: 'fixed',
                          top: `${dropdownPosition.top}px`,
                          right: `${dropdownPosition.right}px`,
                          zIndex: 999999,
                          background: '#FCFCF2',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                          minWidth: '200px',
                          borderRadius: '8px',
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                          padding: '8px 0',
                          margin: 0
                        }}
                      >
                        <li>
                          <div className="dropdown-item-text">
                            <small className="text-muted">{currentUser.email}</small>
                          </div>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <Link 
                            className="dropdown-item" 
                            to="/profile" 
                            onClick={(e) => {
                              e.preventDefault();
                              setShowUserMenu(false);
                              setNavbarOpen(false);
                              navigate("/profile");
                            }}
                          >
                            <i className="bi bi-person-circle me-2"></i>View Profile
                          </Link>
                        </li>
                        <li>
                          <Link 
                            className="dropdown-item" 
                            to="/profile"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowUserMenu(false);
                              setNavbarOpen(false);
                              navigate("/profile");
                            }}
                          >
                            <i className="bi bi-pencil-square me-2"></i>Edit Profile
                          </Link>
                        </li>
                        <li>
                          <Link 
                            className="dropdown-item" 
                            to="/dashboard" 
                            onClick={() => {
                              setShowUserMenu(false);
                              setNavbarOpen(false);
                            }}
                          >
                            <i className="bi bi-speedometer2 me-2"></i>Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link 
                            className="dropdown-item" 
                            to="/dashboard" 
                            onClick={() => {
                              setShowUserMenu(false);
                              setNavbarOpen(false);
                              navigate("/dashboard");
                            }}
                          >
                            <i className="bi bi-envelope-check me-2"></i>Connection Requests
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button 
                            className="dropdown-item text-danger" 
                            onClick={() => {
                              localStorage.removeItem("user");
                              localStorage.removeItem("isAuthenticated");
                              localStorage.removeItem("rememberMe");
                              localStorage.removeItem("authToken");
                              setIsAuthenticated(false);
                              setCurrentUser(null);
                              setShowUserMenu(false);
                              setNavbarOpen(false);
                              navigate("/");
                            }}
                          >
                            <i className="bi bi-box-arrow-right me-2"></i>Logout
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="btn btn-outline-light btn-sm-nav" 
                  onClick={() => setNavbarOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
