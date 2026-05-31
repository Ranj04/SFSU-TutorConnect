/**
 * api.js
 * ------
 * The main API service that handles all communication with the backend.
 * Includes functions for auth, postings, messages, and categories.
 * Has a 5-second timeout and falls back gracefully when the API is down.
 *
 * Contributors: Ranjiv Jithendran, Dhvanil Bhagat, Bao Than
 */

// Get the API base URL from environment variable
// Default to empty string since endpoints already include /api prefix
// For local dev with separate backend, set VITE_API_BASE_URL=http://localhost:8000 in .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Add timeout (5 seconds) for graceful failure
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  // Attach the bearer token (if any) so the server can identify the caller.
  // Identity is derived server-side from this token, never from request ids.
  const authToken = localStorage.getItem('authToken');

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...options.headers,
      },
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // A 401 means our stored session is missing/expired/invalid. Clear it so
    // the UI can react (route guards will redirect to login).
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // FastAPI returns errors in 'detail' field, but some APIs use 'message'
      const errorMessage = errorData.detail || errorData.message || `API Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    // Only log in dev mode to avoid console noise in production
    if (import.meta.env.DEV) {
      console.error(`API request failed for ${endpoint}:`, error);
    }
    throw error;
  }
}

/**
 * Search for tutors with optional filters
 * @param {object} params - Search parameters
 * @param {string} params.category - Subject category slug (e.g., 'computer-science') or 'All'
 * @param {string} params.q - Search query text
 * @param {number} params.page - Page number (1-indexed)
 * @param {number} params.limit - Results per page
 * @returns {Promise<{count: number, total: number, page: number, limit: number, results: Array}>}
 */
export async function searchTutors({ category = 'All', q = '', page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams();
  
  if (category && category !== 'All') {
    params.append('category', category);
  }
  
  if (q && q.trim()) {
    params.append('q', q.trim());
  }

  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const queryString = params.toString();
  const endpoint = `/api/search${queryString ? `?${queryString}` : ''}`;
  
  return await apiFetch(endpoint);
}

/**
 * Get all available subjects for filtering
 * @returns {Promise<{count: number, subjects: Array}>}
 */
export async function getSubjects() {
  return await apiFetch('/api/subjects');
}

// Fallback categories when API is unavailable - Complete SFSU subjects
const FALLBACK_CATEGORIES = [
  { slug: 'computer-science', name: 'Computer Science' },
  { slug: 'mathematics', name: 'Mathematics' },
  { slug: 'physics', name: 'Physics' },
  { slug: 'chemistry', name: 'Chemistry' },
  { slug: 'biology', name: 'Biology' },
  { slug: 'engineering', name: 'Engineering' },
  { slug: 'electrical-engineering', name: 'Electrical Engineering' },
  { slug: 'geosciences', name: 'Geosciences' },
  { slug: 'astronomy', name: 'Astronomy' },
  { slug: 'environmental-studies', name: 'Environmental Studies' },
  { slug: 'business-administration', name: 'Business Administration' },
  { slug: 'accounting', name: 'Accounting' },
  { slug: 'economics', name: 'Economics' },
  { slug: 'finance', name: 'Finance' },
  { slug: 'management', name: 'Management' },
  { slug: 'marketing', name: 'Marketing' },
  { slug: 'information-systems', name: 'Information Systems' },
  { slug: 'psychology', name: 'Psychology' },
  { slug: 'sociology', name: 'Sociology' },
  { slug: 'social-work', name: 'Social Work' },
  { slug: 'criminal-justice', name: 'Criminal Justice' },
  { slug: 'kinesiology', name: 'Kinesiology' },
  { slug: 'nursing', name: 'Nursing' },
  { slug: 'public-health', name: 'Public Health' },
  { slug: 'english', name: 'English' },
  { slug: 'history', name: 'History' },
  { slug: 'philosophy', name: 'Philosophy' },
  { slug: 'political-science', name: 'Political Science' },
  { slug: 'communication-studies', name: 'Communication Studies' },
  { slug: 'journalism', name: 'Journalism' },
  { slug: 'broadcast-communication-arts', name: 'Broadcast & Electronic Communication Arts' },
  { slug: 'cinema', name: 'Cinema' },
  { slug: 'art', name: 'Art' },
  { slug: 'art-history', name: 'Art History' },
  { slug: 'design-and-industry', name: 'Design and Industry' },
  { slug: 'music', name: 'Music' },
  { slug: 'theatre-arts', name: 'Theatre Arts' },
  { slug: 'dance', name: 'Dance' },
  { slug: 'education', name: 'Education' },
  { slug: 'secondary-education', name: 'Secondary Education' },
  { slug: 'special-education', name: 'Special Education' },
  { slug: 'counseling', name: 'Counseling' },
  { slug: 'asian-american-studies', name: 'Asian American Studies' },
  { slug: 'africana-studies', name: 'Africana Studies' },
  { slug: 'latina-latino-studies', name: 'Latina/Latino Studies' },
  { slug: 'american-indian-studies', name: 'American Indian Studies' },
  { slug: 'race-resistance-studies', name: 'Race and Resistance Studies' },
  { slug: 'spanish', name: 'Spanish' },
  { slug: 'french', name: 'French' },
  { slug: 'german', name: 'German' },
  { slug: 'italian', name: 'Italian' },
  { slug: 'japanese', name: 'Japanese' },
  { slug: 'chinese', name: 'Chinese' },
  { slug: 'arabic', name: 'Arabic' },
  { slug: 'portuguese', name: 'Portuguese' },
  { slug: 'humanities', name: 'Humanities' },
  { slug: 'anthropology', name: 'Anthropology' },
  { slug: 'geography', name: 'Geography' },
  { slug: 'linguistics', name: 'Linguistics' },
  { slug: 'womens-gender-studies', name: "Women's and Gender Studies" },
  { slug: 'urban-studies', name: 'Urban Studies' },
  { slug: 'international-relations', name: 'International Relations' },
  { slug: 'hospitality-tourism', name: 'Hospitality and Tourism' },
];

/**
 * Get all available categories (alias for subjects)
 * @returns {Promise<{count: number, categories: Array}>}
 */
export async function getCategories() {
  try {
    return await apiFetch('/api/categories');
  } catch (error) {
    // Fallback to static categories if API fails
    if (import.meta.env.DEV) {
      console.warn('Categories API failed, using fallback:', error.message);
    }
    return { count: FALLBACK_CATEGORIES.length, categories: FALLBACK_CATEGORIES };
  }
}

/**
 * Health check endpoint
 * @returns {Promise<{status: string, message: string}>}
 */
export async function healthCheck() {
  return await apiFetch('/health');
}

/**
 * Create a new tutor posting
 * @param {object} postingData - Posting data
 * @param {number} postingData.course_id - Course ID
 * @param {string} postingData.title - Posting title
 * @param {string} postingData.description - Posting description
 * @param {string} [postingData.availability_notes] - Availability notes
 * @param {number} postingData.user_id - User ID
 * @returns {Promise<object>}
 */
export async function createPosting(postingData) {
  // The owner (user_id) is derived server-side from the auth token; strip it
  // from the body if a caller still includes it.
  // eslint-disable-next-line no-unused-vars
  const { user_id, ...body } = postingData;
  return await apiFetch('/api/postings', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Get postings with optional filters
 * @param {object} params - Query parameters
 * @param {string} [params.status] - Filter by status ('pending', 'approved', 'rejected')
 * @param {number} [params.user_id] - Filter by user ID
 * @returns {Promise<Array>}
 */
export async function getPostings({ status, user_id } = {}) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (user_id) params.append('user_id', user_id);
  
  const queryString = params.toString();
  return await apiFetch(`/api/postings${queryString ? `?${queryString}` : ''}`);
}

/**
 * Get a single posting by ID
 * @param {number} postingId - Posting ID
 * @returns {Promise<object>}
 */
export async function getPostingById(postingId) {
  return await apiFetch(`/api/postings/${postingId}`);
}

/**
 * Get all SFSU courses for dropdowns
 * @returns {Promise<{count: number, courses: Array}>}
 */
export async function getCourses() {
  return await apiFetch('/api/courses');
}

/**
 * API v1 health check
 * @returns {Promise<{status: string, api: string}>}
 */
export async function apiHealthCheck() {
  return await apiFetch('/api/v1/health');
}

/**
 * Register a new user account
 * @param {object} userData - User registration data
 * @param {string} userData.email - SFSU email address
 * @param {string} userData.password - Password (min 8 characters)
 * @param {string} userData.first_name - First name
 * @param {string} userData.last_name - Last name
 * @param {string} [userData.major] - Optional major
 * @returns {Promise<{message: string, user: object}>}
 */
export async function registerUser(userData) {
  return await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Login a user
 * @param {object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<{message: string, user: object}>}
 */
export async function loginUser(credentials) {
  return await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Send a message
 * @param {object} messageData - Message data
 * @param {number} messageData.sender_user_id - ID of sender
 * @param {number} messageData.recipient_user_id - ID of recipient
 * @param {number} [messageData.tutor_profile_id] - Optional tutor profile ID
 * @param {string} messageData.message_text - Message content
 * @param {number} [messageData.parent_message_id] - Optional parent message ID for replies
 * @returns {Promise<{message: string, data: object}>}
 */
export async function sendMessage(messageData) {
  // The sender is derived server-side from the auth token; never send it.
  // eslint-disable-next-line no-unused-vars
  const { sender_user_id, ...body } = messageData;
  return await apiFetch(`/api/messages`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Get message thread between two users
 * @param {number} userId - Current user ID
 * @param {number} otherUserId - Conversation partner ID
 * @param {number} [postingId] - Optional posting ID to filter by specific posting
 * @returns {Promise<{count: number, messages: Array}>}
 */
export async function getMessageThread(userId, otherUserId, postingId = null) {
  // The current user is derived server-side from the auth token; only the
  // conversation partner (and optional posting) are sent.
  const params = new URLSearchParams({
    other_user_id: otherUserId.toString(),
  });

  if (postingId) {
    params.append('posting_id', postingId.toString());
  }

  return await apiFetch(`/api/messages/thread?${params.toString()}`);
}

/**
 * Get all conversations for the authenticated user (identity from the token).
 * @returns {Promise<{count: number, conversations: Array}>}
 */
export async function getConversations() {
  return await apiFetch(`/api/messages/conversations`);
}

/**
 * Get connection requests (incoming or sent) for the authenticated user.
 * @param {string} type - 'incoming' or 'sent'
 * @returns {Promise<{count: number, requests: Array}>}
 */
export async function getConnectionRequests(type = 'incoming') {
  // The user is derived server-side from the auth token; only 'type' is sent.
  const params = new URLSearchParams({ type });
  return await apiFetch(`/api/messages/connection-requests?${params.toString()}`);
}

/**
 * Accept a connection request (acting user derived from the auth token).
 * @param {number} messageId - Message ID
 * @returns {Promise<{message: string, data: object}>}
 */
export async function acceptConnectionRequest(messageId) {
  return await apiFetch(`/api/messages/${messageId}/accept`, {
    method: 'PATCH',
  });
}

/**
 * Decline a connection request (acting user derived from the auth token).
 * @param {number} messageId - Message ID
 * @returns {Promise<{message: string, data: object}>}
 */
export async function declineConnectionRequest(messageId) {
  return await apiFetch(`/api/messages/${messageId}/decline`, {
    method: 'PATCH',
  });
}

/**
 * Create a review for a posting (reviewing student derived from the auth token).
 * @param {object} data
 * @param {number} data.posting_id - Posting ID
 * @param {number} data.rating - Rating 1-5
 * @param {string} [data.comment] - Optional comment
 * @returns {Promise<{message: string, data: object}>}
 */
export async function createReview({ posting_id, rating, comment = "" }) {
  return await apiFetch(`/api/reviews`, {
    method: 'POST',
    body: JSON.stringify({ posting_id, rating, comment }),
  });
}

/**
 * Update user profile photo
 * @param {number} userId - User ID
 * @param {string} profilePhotoUrl - Profile photo URL (can be base64 data URL)
 * @returns {Promise<{message: string, user: object}>}
 */
export async function updateProfilePhoto(userId, profilePhotoUrl) {
  return await apiFetch(`/api/auth/users/${userId}/profile-photo`, {
    method: 'PATCH',
    body: JSON.stringify({ profile_photo_url: profilePhotoUrl }),
  });
}

/**
 * Get user profile information
 * @param {number} userId - User ID
 * @returns {Promise<{user: object, tutor_profile: object|null}>}
 */
export async function getUserProfile(userId) {
  return await apiFetch(`/api/auth/users/${userId}/profile`);
}

/**
 * Update user profile (major, etc.)
 * @param {number} userId - User ID
 * @param {object} profileData - Profile data
 * @param {string} [profileData.major] - Major field
 * @returns {Promise<{message: string, user: object}>}
 */
export async function updateUserProfile(userId, profileData) {
  return await apiFetch(`/api/auth/users/${userId}/profile`, {
    method: 'PATCH',
    body: JSON.stringify(profileData),
  });
}

/**
 * Update tutor profile (bio, experience, etc.)
 * @param {number} userId - User ID
 * @param {object} tutorData - Tutor profile data
 * @param {string} [tutorData.bio] - Bio text
 * @param {number} [tutorData.years_of_experience] - Years of experience
 * @param {string} [tutorData.tutoring_format] - Format: 'in_person', 'online', 'hybrid'
 * @param {string} [tutorData.preferred_meeting_location] - Meeting location
 * @returns {Promise<{message: string, tutor_profile: object}>}
 */
export async function updateTutorProfile(userId, tutorData) {
  return await apiFetch(`/api/auth/users/${userId}/tutor-profile`, {
    method: 'PATCH',
    body: JSON.stringify(tutorData),
  });
}

// Export the base URL for reference
export { API_BASE_URL };

