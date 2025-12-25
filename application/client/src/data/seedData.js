/**
 * seedData.js
 * -----------
 * Fallback seed data for when the backend is unavailable or the browser has
 * no localStorage. Ensures the app works on fresh browser profiles (like
 * during grading demos).
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */

export const SEED_POSTINGS = [
  {
    id: 1,
    title: "CSC 648 Software Engineering Tutor",
    name: "Alex Chen",
    bio: "Experienced TA for CSC 648. I can help with project structure, requirements analysis, software engineering best practices, and team collaboration strategies.",
    subjects: ["Computer Science"],
    courses: ["CSC 648 - Software Engineering"],
    rate: 25,
    availability: ["Monday Afternoon", "Tuesday Morning", "Wednesday Evening"],
    status: "approved",
    createdAt: new Date().toISOString(),
    userId: 1,
  },
  {
    id: 2,
    title: "MATH 226 Calculus I Tutor",
    name: "Sarah Johnson",
    bio: "Math major with strong background in calculus. Available for one-on-one tutoring sessions. Patient and clear explanations.",
    subjects: ["Mathematics"],
    courses: ["MATH 226 - Calculus I"],
    rate: 20,
    availability: ["Monday Morning", "Wednesday Afternoon", "Friday Morning"],
    status: "approved",
    createdAt: new Date().toISOString(),
    userId: 2,
  },
  {
    id: 3,
    title: "CSC 220 Data Structures Expert",
    name: "Michael Torres",
    bio: "Computer Science senior specializing in data structures and algorithms. Can help with linked lists, trees, graphs, and algorithm analysis.",
    subjects: ["Computer Science"],
    courses: ["CSC 220 - Data Structures"],
    rate: 30,
    availability: ["Tuesday Evening", "Thursday Afternoon", "Saturday Morning"],
    status: "approved",
    createdAt: new Date().toISOString(),
    userId: 3,
  },
  {
    id: 4,
    title: "FIN 350 Corporate Finance Tutor",
    name: "Emily Rodriguez",
    bio: "Business major with expertise in corporate finance. Help with financial statements, valuation, and investment analysis.",
    subjects: ["Business"],
    courses: ["FIN 350 - Corporate Finance"],
    rate: 22,
    availability: ["Monday Evening", "Wednesday Morning", "Friday Afternoon"],
    status: "approved",
    createdAt: new Date().toISOString(),
    userId: 4,
  },
  {
    id: 5,
    title: "PSY 200 General Psychology Tutor",
    name: "David Kim",
    bio: "Psychology major available to help with understanding psychological concepts, research methods, and exam preparation.",
    subjects: ["Psychology"],
    courses: ["PSY 200 - General Psychology"],
    rate: 18,
    availability: ["Tuesday Morning", "Thursday Evening", "Sunday Afternoon"],
    status: "approved",
    createdAt: new Date().toISOString(),
    userId: 5,
  },
  {
    id: 6,
    title: "CSC 340 Programming Methodology",
    name: "Jessica Martinez",
    bio: "Experienced programmer helping students with object-oriented design, testing strategies, and best coding practices.",
    subjects: ["Computer Science"],
    courses: ["CSC 340 - Programming Methodology"],
    rate: 28,
    availability: ["Monday Morning", "Wednesday Evening", "Saturday Afternoon"],
    status: "approved",
    createdAt: new Date().toISOString(),
    userId: 6,
  },
];

export const SEED_MESSAGES = [
  {
    id: 1,
    postingId: 1,
    postingTitle: "CSC 648 Software Engineering Tutor",
    messageText: "Hi, I'm interested in tutoring for CSC 648. Can you help me with project requirements?",
    contactEmail: "student1@sfsu.edu",
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 2,
    postingId: 3,
    postingTitle: "CSC 220 Data Structures Expert",
    messageText: "I need help understanding binary trees and traversals. Are you available this week?",
    contactEmail: "student2@sfsu.edu",
    sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
];

/**
 * Initialize seed data in localStorage if not already present
 */
export function initializeSeedData() {
  // Only initialize if localStorage is empty (clean browser)
  const existingPostings = localStorage.getItem('mockPostings');
  const existingMessages = localStorage.getItem('messages');
  
  if (!existingPostings || JSON.parse(existingPostings).length === 0) {
    localStorage.setItem('mockPostings', JSON.stringify(SEED_POSTINGS));
  }
  
  if (!existingMessages || JSON.parse(existingMessages).length === 0) {
    localStorage.setItem('messages', JSON.stringify(SEED_MESSAGES));
  }
}

