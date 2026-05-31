/**
 * analytics.js
 * ------------
 * Google Analytics 4 integration for TutorConnect.
 * Tracks page views and custom events across the platform.
 *
 * Usage:
 *   import { initGA, trackEvent, trackSearch } from "../utils/analytics";
 *
 * Contributors: Team 02
 */
import ReactGA from "react-ga4";

// GA4 Measurement ID - configured per environment via .env (VITE_GA_MEASUREMENT_ID).
// No hardcoded fallback: if unset, analytics simply no-ops (see initGA guard below).
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

/**
 * Initialize Google Analytics
 * Call this once when the app loads
 */
export const initGA = () => {
  // Don't initialize if no valid measurement ID
  if (!MEASUREMENT_ID) {
    console.warn("Google Analytics: No Measurement ID configured");
    return;
  }

  ReactGA.initialize(MEASUREMENT_ID, {
    // Enable debug mode in development
    gaOptions: {
      debug_mode: import.meta.env.DEV,
    },
  });

  console.log("Google Analytics initialized");
};

/**
 * Track a page view
 * @param {string} path - The page path (e.g., "/dashboard")
 */
export const trackPageView = (path) => {
  ReactGA.send({ 
    hitType: "pageview", 
    page: path,
    title: document.title,
  });
};

/**
 * Track a custom event
 * @param {string} category - Event category (e.g., "Engagement")
 * @param {string} action - Event action (e.g., "button_click")
 * @param {string} label - Event label (optional, e.g., "signup_button")
 * @param {number} value - Event value (optional)
 */
export const trackEvent = (category, action, label, value) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// ============================================
// Custom Events for TutorConnect Platform
// ============================================

/**
 * Track search queries
 * @param {string} searchTerm - The search term entered
 * @param {string} category - The category/subject selected
 */
export const trackSearch = (searchTerm, category = "All") => {
  ReactGA.event({
    category: "Search",
    action: "search_query",
    label: `${category}: ${searchTerm}`,
  });
};

/**
 * Track when a user contacts a tutor
 * @param {string|number} tutorId - The tutor's ID
 * @param {string} tutorName - The tutor's name (optional)
 */
export const trackTutorContact = (tutorId, tutorName = "") => {
  ReactGA.event({
    category: "Engagement",
    action: "contact_tutor",
    label: tutorName || `Tutor ${tutorId}`,
  });
};

/**
 * Track when a user views a tutor posting
 * @param {string|number} postingId - The posting ID
 * @param {string} subject - The subject/category
 */
export const trackPostingView = (postingId, subject = "") => {
  ReactGA.event({
    category: "Engagement",
    action: "view_posting",
    label: subject || `Posting ${postingId}`,
  });
};

/**
 * Track user login
 * @param {string} method - Login method (e.g., "email", "google")
 */
export const trackLogin = (method = "email") => {
  ReactGA.event({
    category: "Authentication",
    action: "login",
    label: method,
  });
};

/**
 * Track user signup/registration
 * @param {string} userType - Type of user (e.g., "tutee", "tutor")
 */
export const trackSignup = (userType = "tutee") => {
  ReactGA.event({
    category: "Authentication",
    action: "signup",
    label: userType,
  });
};

/**
 * Track when a user applies to become a tutor
 */
export const trackTutorApplication = () => {
  ReactGA.event({
    category: "Conversion",
    action: "tutor_application",
    label: "become_tutor",
  });
};

/**
 * Track message sent
 * @param {string} context - Where the message was sent from
 */
export const trackMessageSent = (context = "messaging") => {
  ReactGA.event({
    category: "Engagement",
    action: "message_sent",
    label: context,
  });
};

/**
 * Track button/CTA clicks
 * @param {string} buttonName - Name/identifier of the button
 * @param {string} location - Where on the site the button is
 */
export const trackButtonClick = (buttonName, location = "unknown") => {
  ReactGA.event({
    category: "UI Interaction",
    action: "button_click",
    label: `${location}: ${buttonName}`,
  });
};

