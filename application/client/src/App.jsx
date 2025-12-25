/**
 * App.jsx
 * -------
 * The main application component that sets up routing and renders the app shell.
 * All page routes are defined here, along with protected route wrappers for
 * pages that require authentication.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "./components/Toast";
import { useToast } from "./hooks/useToast";
import { usePageTracking } from "./hooks/usePageTracking";
import { initGA } from "./utils/analytics";
import About from "./pages/About";
import MemberDetail from "./pages/MemberDetail";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Messaging from "./pages/Messaging";
import Messages from "./pages/Messages";
import Dashboard from "./pages/Dashboard";
import Posting from "./pages/Posting";
import TuteeDashboard from "./pages/TuteeDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import TermsOfService from "./pages/TermsOfService";
import BecomeTutor from "./pages/BecomeTutor";
import PostingDetail from "./pages/PostingDetail";
import ContactTutor from "./pages/ContactTutor";
import ForgotPassword from "./pages/ForgotPassword";
import QAHelper from "./pages/QAHelper";
import Profile from "./pages/Profile";
import { initializeSeedData } from "./data/seedData";

// Toast provider component
function ToastProvider({ children }) {
  const toast = useToast();
  // Make toast available globally via context if needed
  return (
    <>
      {children}
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </>
  );
}

// Page tracker component - must be inside Router to use useLocation
function PageTracker() {
  usePageTracking();
  return null;
}

export default function App() {
  // Initialize Google Analytics and seed data on app load
  React.useEffect(() => {
    initGA();
    initializeSeedData();
  }, []);
  
  return (
    <Router>
      {/* Track page views on route changes */}
      <PageTracker />
      <ToastProvider>
        {/* Keep the navigation persistent so users can hop between flows */}
        <Navbar />

      {/* Route table keeps public vs demo-only routes separate so it's easy to hook auth later */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />  {/* default landing page */}
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />  {/* Find Tutors */}
        <Route path="/about" element={<About />} />
        <Route path="/about/:id" element={<MemberDetail />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/become-tutor" element={<BecomeTutor />} />
        <Route path="/postings/:postingId" element={<PostingDetail />} />
        {import.meta.env.DEV && <Route path="/qa" element={<QAHelper />} />}
        
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes - Require authentication */}
        <Route path="/messaging" element={<ProtectedRoute><Messaging /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/tutee" element={<ProtectedRoute><TuteeDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/tutor" element={<ProtectedRoute><TutorDashboard /></ProtectedRoute>} />
        <Route path="/post" element={<ProtectedRoute><Posting /></ProtectedRoute>} />
        <Route path="/contact-tutor" element={<ProtectedRoute><ContactTutor /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Catch-all 404 so folks don't get a blank screen on typos */}
        <Route
          path="*"
          element={
            <div className="container py-5 text-center">
              <h2 className="text-danger mb-3">Page Not Found</h2>
              <p>The page you are looking for does not exist.</p>
              <Link to="/home" className="btn btn-sfsu-purple mt-3">
                Back to Home
              </Link>
            </div>
          }
        />
      </Routes>
      </ToastProvider>
    </Router>
  );
}
