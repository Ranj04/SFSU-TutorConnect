/**
 * usePageTracking.js
 * ------------------
 * React hook to automatically track page views on route changes.
 * Must be used inside a Router component.
 *
 * Usage:
 *   function PageTracker() {
 *     usePageTracking();
 *     return null;
 *   }
 *
 * Contributors: Team 02
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/analytics";

/**
 * Hook that tracks page views whenever the route changes
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track the page view with full path including search params
    const fullPath = location.pathname + location.search;
    trackPageView(fullPath);
  }, [location]);
};

export default usePageTracking;

