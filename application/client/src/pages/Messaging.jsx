/**
 * Messaging.jsx
 * -------------
 * A direct messaging view for communication between students and tutors.
 * Shows the message thread and allows sending new messages.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getMessageThread, sendMessage as sendMessageAPI } from "../services/api";
import { getCurrentUser } from "../utils/auth";

export default function Messaging() {
  const [searchParams] = useSearchParams();
  const tutorId = searchParams.get("tutorId");
  const otherUserId = searchParams.get("userId");

  // Authentication is enforced by <ProtectedRoute> in App.jsx; no in-component
  // early return (that would run before the hooks below and violate the Rules
  // of Hooks).
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Wrap thread loading so we can reuse it after sendMessage completes
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMessageThread(currentUserId, otherUserId);
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, otherUserId]);

  useEffect(() => {
    if (!currentUserId || !otherUserId) {
      setError("Missing user information. Please login.");
      setLoading(false);
      return;
    }

    loadMessages();
  }, [currentUserId, otherUserId, loadMessages]);

  // Fire-and-forget send that optimistically reloads the thread afterward
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId || !otherUserId) {
      return;
    }

    try {
      setSending(true);
      setError(null);

      // sender is derived server-side from the auth token; do not send it.
      // The backend MessageCreate model takes posting_id (not tutor_profile_id).
      await sendMessageAPI({
        recipient_user_id: parseInt(otherUserId),
        posting_id: tutorId ? parseInt(tutorId) : null,
        message_text: newMessage.trim(),
      });

      setNewMessage("");
      // Reload messages
      await loadMessages();
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Messages</h4>
              <Link to="/dashboard/tutee" className="btn btn-sm btn-outline-secondary">
                Back to Dashboard
              </Link>
            </div>

            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages Thread */}
                  <div
                    className="border rounded p-3 mb-3"
                    style={{ minHeight: "400px", maxHeight: "500px", overflowY: "auto" }}
                  >
                    {messages.length === 0 ? (
                      <div className="text-center text-muted py-5">
                        <p>No messages yet. Start the conversation below!</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isSent = msg.sender_user_id === currentUserId;
                        return (
                          <div
                            key={msg.id}
                            className={`mb-3 ${isSent ? "text-end" : "text-start"}`}
                          >
                            <div
                              className={`d-inline-block p-3 rounded ${
                                isSent
                                  ? "bg-primary text-white"
                                  : "bg-light border"
                              }`}
                              style={{ maxWidth: "70%" }}
                            >
                              <div className="small mb-1">
                                <strong>{msg.sender_name}</strong>
                              </div>
                              <div>{msg.message_text}</div>
                              <div className="small mt-1 opacity-75">
                                {new Date(msg.sent_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSend}>
                    <div className="input-group">
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={sending || !newMessage.trim()}
                      >
                        {sending ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

