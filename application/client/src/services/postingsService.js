/**
 * postingsService.js
 * ------------------
 * Handles tutor postings with backend API calls and a fallback to seed data.
 * This ensures the app works even on a clean browser with no prior data.
 *
 * Contributors: Ranjiv Jithendran, Dhvanil Bhagat
 */
import { searchTutors, createPosting as apiCreatePosting, getPostings as apiGetPostings, getPostingById as apiGetPostingById } from './api';
import { SEED_POSTINGS, initializeSeedData } from '../data/seedData';

/**
 * Get all approved postings
 * Tries backend API first, falls back to seed data if unavailable
 */
export async function getApprovedPostings({ category = 'All', q = '', page = 1, limit = 10 } = {}) {
  try {
    // Try backend API first
    const response = await searchTutors({ category, q, page, limit });
    
    // Backend now returns postings with user info; map to posting format
    const postings = response.results.map((item) => ({
      // Posting and tutor identifiers
      id: item.id, // posting id
      userId: item.user_id, // owner/tutor user id

      // Display fields
      title: item.title || (item.courses && item.courses.length > 0 
        ? `${item.courses[0]} Tutor` 
        : `${item.subjects && item.subjects.length > 0 ? item.subjects[0] : 'Tutor'}`),
      name: item.name,
      bio: item.bio || '',
      subjects: item.subjects || [],
      courses: item.courses || [],

      // Rating & rate
      rating: item.avg_rating || null,
      reviewCount: item.review_count || 0,
      rate: item.rate || (item.avg_rating ? Math.round(item.avg_rating * 5) + 15 : 25),
      availability: ['Monday Morning', 'Tuesday Afternoon', 'Wednesday Evening'],
      status: 'approved',
      profilePhotoUrl: item.profile_photo_url || null,

      // Metadata
      createdAt: item.created_at || new Date().toISOString(),
    }));
    
    return {
      count: response.count,
      total: response.total,
      page: response.page,
      limit: response.limit,
      results: postings,
    };
  } catch (error) {
    console.warn('Backend API unavailable, using seed data fallback:', error);
    
    // Initialize seed data if needed
    initializeSeedData();
    
    // Load from localStorage (seed data or user-created)
    const allPostings = JSON.parse(localStorage.getItem('mockPostings') || '[]');
    
    // Filter: only approved, and apply search filters
    let filtered = allPostings.filter(p => p.status === 'approved');
    
    // Filter by category
    if (category && category !== 'All') {
      filtered = filtered.filter(p => 
        p.subjects.some(s => s.toLowerCase().includes(category.toLowerCase()))
      );
    }
    
    // Filter by search query
    if (q && q.trim()) {
      const queryLower = q.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(queryLower) ||
        p.bio.toLowerCase().includes(queryLower) ||
        p.courses.some(c => c.toLowerCase().includes(queryLower)) ||
        p.subjects.some(s => s.toLowerCase().includes(queryLower))
      );
    }
    
    // Paginate
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);
    
    return {
      count: paginated.length,
      total,
      page,
      limit,
      results: paginated,
    };
  }
}

/**
 * Get a single posting by ID
 */
export async function getPostingById(id) {
  try {
    // Try backend API first
    const posting = await apiGetPostingById(id);
    
    if (posting) {
      return {
        id: posting.id,
        title: posting.title,
        name: posting.user_name || 'Tutor',
        bio: posting.description,
        subjects: extractSubjects(posting.description),
        courses: [],
        rate: extractRate(posting.description) || 0,
        availability: posting.availability_notes ? posting.availability_notes.split(', ') : [],
        status: posting.status,
        createdAt: posting.created_at,
        userId: posting.user_id,
        profilePhotoUrl: posting.profile_photo_url || null,
      };
    }
  } catch (error) {
    console.warn('Backend API unavailable, checking localStorage:', error);
  }
  
  // Fallback to localStorage
  initializeSeedData();
  const allPostings = JSON.parse(localStorage.getItem('mockPostings') || '[]');
  return allPostings.find(p => p.id === id || p.id === parseInt(id)) || null;
}

// Helper function to extract rate from description
function extractRate(description) {
  const rateMatch = description?.match(/\*\*Rate:\*\*\s*\$?([\d.]+)/);
  return rateMatch ? parseFloat(rateMatch[1]) : null;
}

// Helper function to extract subjects from description
function extractSubjects(description) {
  const subjectsMatch = description?.match(/\*\*Subjects:\*\*\s*([^\n]+)/);
  return subjectsMatch ? subjectsMatch[1].split(',').map(s => s.trim()) : [];
}

/**
 * Create a new posting
 * Calls backend API to save to database
 */
export async function createPosting(postingData) {
  try {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    // Use provided courseId if available; otherwise backend will pick a default
    let courseId = postingData.courseId || null;
    
    // Prepare data for backend
    const backendData = {
      user_id: user.id,
      course_id: courseId,
      title: postingData.title,
      description: postingData.bio || postingData.description,
      subjects: postingData.subjects || [],
      rate: postingData.rate ? parseFloat(postingData.rate) : null,
      availability: postingData.availability || [],
      availability_notes: null,
    };
    
    // Call backend API
    const response = await apiCreatePosting(backendData);
    
    // Also store in localStorage for immediate UI feedback
    initializeSeedData();
    const allPostings = JSON.parse(localStorage.getItem('mockPostings') || '[]');
    const localPosting = {
      ...postingData,
      id: response.id,
      status: 'pending',
      createdAt: response.created_at,
    };
    allPostings.push(localPosting);
    localStorage.setItem('mockPostings', JSON.stringify(allPostings));
    
    return response;
  } catch (error) {
    console.error('Failed to create posting via API, falling back to localStorage:', error);
    
    // Fallback to localStorage only
    initializeSeedData();
    const allPostings = JSON.parse(localStorage.getItem('mockPostings') || '[]');
    
    const newPosting = {
      ...postingData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    allPostings.push(newPosting);
    localStorage.setItem('mockPostings', JSON.stringify(allPostings));
    
    return newPosting;
  }
}

/**
 * Update posting status (admin/dev use)
 */
export function updatePostingStatus(id, status) {
  const allPostings = JSON.parse(localStorage.getItem('mockPostings') || '[]');
  const index = allPostings.findIndex(p => p.id === id || p.id === parseInt(id));
  
  if (index >= 0) {
    allPostings[index].status = status;
    localStorage.setItem('mockPostings', JSON.stringify(allPostings));
    return allPostings[index];
  }
  
  return null;
}

