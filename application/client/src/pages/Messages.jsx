/**
 * Messages.jsx
 * ------------
 * Connection Requests page showing incoming and sent connection requests.
 * Tutors can accept/decline incoming requests from students.
 * Students can view their sent requests.
 *
 * Contributors: Ranjiv Jithendran, Dhvanil Bhagat
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getConnectionRequests, acceptConnectionRequest, declineConnectionRequest } from "../services/api";
import { getCurrentUser } from "../utils/auth";

export default function Messages() {
  // Authentication is enforced by <ProtectedRoute> in App.jsx; no in-component
  // early return (that would run before the hooks below and violate the Rules
  // of Hooks).
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id;
  
  // State
  const [activeTab, setActiveTab] = useState("incoming"); // "incoming" or "sent"
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState(null);
  
  // Fetch connection requests from database
  useEffect(() => {
    async function fetchRequests() {
      if (!currentUserId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both incoming and sent requests
        const [incomingResponse, sentResponse] = await Promise.all([
          getConnectionRequests('incoming'),
          getConnectionRequests('sent')
        ]);

        setIncomingRequests(incomingResponse.requests || []);
        setSentRequests(sentResponse.requests || []);
      } catch (err) {
        console.error('Error fetching connection requests:', err);
        setError(err.message || "Failed to load connection requests");
        setIncomingRequests([]);
        setSentRequests([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRequests();
  }, [currentUserId]);
  
  const handleAccept = async (messageId) => {
    if (!currentUserId) return;
    
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
  
  const handleDecline = async (messageId) => {
    if (!currentUserId) return;
    
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
  
  const currentRequests = activeTab === "incoming" ? filteredIncoming : filteredSent;
  const pendingCount = incomingRequests.filter(r => r.connection_status === 'pending').length;
  
  return (
    <div className="container-fluid py-4" style={{ minHeight: '100vh', backgroundColor: '#faf8f2' }}>
      <div className="row g-0" style={{ minHeight: "calc(100vh - 200px)" }}>
        {/* Left Panel: Connection Requests */}
        <div className="col-12 col-lg-5 border-end d-flex flex-column" style={{ backgroundColor: 'white', minHeight: "400px" }}>
          <div className="p-4 border-bottom">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0" style={{ color: '#411545' }}>Connection Requests</h4>
              {pendingCount > 0 && (
                <span className="badge" style={{ backgroundColor: '#ffa500', color: '#411545', fontSize: '0.75rem' }}>
                  {pendingCount} pending
                </span>
              )}
            </div>
            <p className="text-muted small mb-3">
              One-round requests: Accept/decline, then connect outside the app.
            </p>
            
            {/* Tabs */}
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "incoming" ? "active" : ""}`}
                  onClick={() => setActiveTab("incoming")}
                  style={{
                    color: activeTab === "incoming" ? '#411545' : '#6b6b6b',
                    backgroundColor: activeTab === "incoming" ? 'transparent' : 'transparent',
                    borderBottom: activeTab === "incoming" ? '2px solid #411545' : 'none',
                    fontWeight: activeTab === "incoming" ? '600' : 'normal'
                  }}
                >
                  Incoming
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "sent" ? "active" : ""}`}
                  onClick={() => setActiveTab("sent")}
                  style={{
                    color: activeTab === "sent" ? '#411545' : '#6b6b6b',
                    backgroundColor: activeTab === "sent" ? 'transparent' : 'transparent',
                    borderBottom: activeTab === "sent" ? '2px solid #411545' : 'none',
                    fontWeight: activeTab === "sent" ? '600' : 'normal'
                  }}
                >
                  Sent
                </button>
              </li>
            </ul>
            
            {/* Search */}
            <div className="input-group mt-3">
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
          </div>
          
          {/* Requests List */}
          <div className="flex-grow-1 overflow-auto">
            {loading ? (
              <div className="p-4 text-center text-muted">
                <div className="spinner-border spinner-border-sm mb-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading requests...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-danger">
                <i className="bi bi-exclamation-triangle fs-1 d-block mb-2"></i>
                <p>{error}</p>
              </div>
            ) : currentRequests.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                <p>No {activeTab} requests found</p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {currentRequests.map((request) => {
                  const isPending = request.connection_status === 'pending';
                  const isAccepted = request.connection_status === 'accepted';
                  const isDeclined = request.connection_status === 'declined';
                  const displayName = activeTab === "incoming" ? request.sender_name : request.recipient_name;
                  const displayEmail = activeTab === "incoming" ? request.sender_email : request.recipient_email;
                  
                  return (
                    <div
                      key={request.id}
                      className="list-group-item border-bottom p-3"
                      style={{ backgroundColor: 'white' }}
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
                                <span className="badge" style={{ backgroundColor: '#ffa500', color: '#411545' }}>
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
                          
                          {activeTab === "incoming" && isPending && (
                            <div className="d-flex gap-2 mt-3">
                              <button
                                className="btn btn-sm"
                                onClick={() => handleAccept(request.id)}
                                disabled={processingId === request.id}
                                style={{
                                  backgroundColor: '#28a745',
                                  color: 'white',
                                  border: 'none'
                                }}
                              >
                                <i className="bi bi-check"></i> Accept
                              </button>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleDecline(request.id)}
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
        
        {/* Right Panel: How Connection Requests Work */}
        <div className="col-12 col-lg-7 d-flex flex-column p-4" style={{ backgroundColor: '#faf8f2', minHeight: "400px" }}>
          <div className="text-center mb-4">
            <i className="bi bi-hand-thumbs-up" style={{ fontSize: '3rem', color: '#6b6b6b' }}></i>
            <h3 className="mt-3" style={{ color: '#411545' }}>How Connection Requests Work</h3>
          </div>
          
          <div className="mb-4">
            <div className="d-flex align-items-start mb-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                   style={{ width: '32px', height: '32px', backgroundColor: '#411545', color: 'white', fontWeight: 'bold' }}>
                1
              </div>
              <div>
                <h6 style={{ color: '#411545' }}>Students send requests</h6>
                <p className="text-muted mb-0">
                  Include a message and your contact info (email, phone, Discord, etc.)
                </p>
              </div>
            </div>
            
            <div className="d-flex align-items-start mb-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                   style={{ width: '32px', height: '32px', backgroundColor: '#411545', color: 'white', fontWeight: 'bold' }}>
                2
              </div>
              <div>
                <h6 style={{ color: '#411545' }}>Tutors review and decide</h6>
                <p className="text-muted mb-0">
                  Accept or decline each request. This decision is final.
                </p>
              </div>
            </div>
            
            <div className="d-flex align-items-start mb-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                   style={{ width: '32px', height: '32px', backgroundColor: '#411545', color: 'white', fontWeight: 'bold' }}>
                3
              </div>
              <div>
                <h6 style={{ color: '#411545' }}>Connect outside the app</h6>
                <p className="text-muted mb-0">
                  After acceptance, use contact info to arrange tutoring sessions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-auto p-3 rounded" style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
            <p className="mb-0 small" style={{ color: '#856404' }}>
              <strong>Tip:</strong> Declined? You can send another request to the same tutor if needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
