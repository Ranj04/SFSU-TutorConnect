/**
 * messagesService.js
 * ------------------
 * Handles sending and retrieving messages between students and tutors.
 * Falls back to localStorage when the backend is unavailable.
 *
 * Contributors: Ranjiv Jithendran, Dhvanil Bhagat
 */
import { sendMessage, getConversations, API_BASE_URL } from './api';
import { SEED_MESSAGES, initializeSeedData } from '../data/seedData';

/**
 * Send a message to a tutor
 * Tries backend API first, falls back to localStorage
 */
export async function sendTutorMessage(messageData) {
  try {
    // Try backend API
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      const response = await sendMessage({
        sender_user_id: user.id,
        recipient_user_id: messageData.recipientUserId || 1,
        posting_id: messageData.postingId, // Fixed: was tutor_profile_id
        message_text: messageData.messageText,
        contact_info: messageData.contactEmail,
      });
      return response.data;
    }
  } catch (error) {
    console.warn('Backend API unavailable, storing in localStorage:', error);
  }
  
  // Fallback to localStorage
  initializeSeedData();
  const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
  
  const newMessage = {
    id: Date.now(),
    postingId: messageData.postingId,
    postingTitle: messageData.postingTitle,
    messageText: messageData.messageText,
    contactEmail: messageData.contactEmail,
    sentAt: new Date().toISOString(),
  };
  
  allMessages.push(newMessage);
  localStorage.setItem('messages', JSON.stringify(allMessages));
  
  return newMessage;
}

/**
 * Get all messages for dashboard
 * Tries backend API first, falls back to localStorage
 */
export async function getUserMessages() {
  try {
    // Try backend API
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      const response = await getConversations(user.id);
      // Map backend format to frontend format
      return response.conversations.map((conv, idx) => ({
        id: idx + 1,
        postingId: conv.posting_id,
        postingTitle: conv.posting_title || conv.partner_name,
        messageText: conv.last_message,
        contactEmail: user.email || 'user@sfsu.edu',
        sentAt: conv.last_message_time,
        timestamp: conv.last_message_time,
        createdAt: new Date(conv.last_message_time).toLocaleString(),
      }));
    }
  } catch (error) {
    console.warn('Backend API unavailable, using localStorage:', error);
  }
  
  // Fallback to localStorage
  initializeSeedData();
  return JSON.parse(localStorage.getItem('messages') || '[]');
}

