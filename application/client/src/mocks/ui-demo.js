/**
 * ui-demo.js
 * ----------
 * Mock data used for UI development and as a fallback when the API is down.
 * Includes sample courses, subjects, tutors, messages, and postings.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */

// Mock SFSU courses
export const SFSU_COURSES = [
  { code: 'CSC 210', name: 'Introduction to Computer Programming', department: 'Computer Science' },
  { code: 'CSC 220', name: 'Data Structures', department: 'Computer Science' },
  { code: 'CSC 648', name: 'Software Engineering', department: 'Computer Science' },
  { code: 'CSC 675', name: 'Database Systems', department: 'Computer Science' },
  { code: 'MATH 226', name: 'Calculus I', department: 'Mathematics' },
  { code: 'MATH 227', name: 'Calculus II', department: 'Mathematics' },
  { code: 'MATH 324', name: 'Probability and Statistics', department: 'Mathematics' },
  { code: 'PHYS 111', name: 'General Physics I', department: 'Physics' },
  { code: 'PHYS 112', name: 'General Physics II', department: 'Physics' },
  { code: 'CHEM 115', name: 'General Chemistry I', department: 'Chemistry' },
  { code: 'BIOL 230', name: 'Introductory Biology', department: 'Biology' },
  { code: 'BUS 300', name: 'Business Communication', department: 'Business' },
];

// Mock upcoming sessions (student view)
export const MOCK_UPCOMING_SESSIONS = [
  {
    id: 1,
    tutorName: 'Casey Smith',
    course: 'CSC 648',
    date: '2025-02-15',
    time: '2:00 PM',
    format: 'Online',
    status: 'confirmed'
  },
  {
    id: 2,
    tutorName: 'Jordan Lee',
    course: 'MATH 226',
    date: '2025-02-18',
    time: '10:00 AM',
    format: 'In Person',
    status: 'pending'
  },
];

// Mock saved tutors
export const MOCK_SAVED_TUTORS = [
  {
    id: 1,
    name: 'Casey Smith',
    subject: 'Computer Science',
    rating: 4.8,
    reviewCount: 24,
    rate: 25,
    avatar: null
  },
  {
    id: 2,
    name: 'Jordan Lee',
    subject: 'Mathematics',
    rating: 4.9,
    reviewCount: 18,
    rate: 30,
    avatar: null
  },
  {
    id: 3,
    name: 'Riley Chen',
    subject: 'Computer Science',
    rating: 4.7,
    reviewCount: 15,
    rate: 22,
    avatar: null
  },
];

// Mock messages preview (last 3)
export const MOCK_MESSAGES_PREVIEW = [
  {
    id: 1,
    from: 'Casey Smith',
    preview: 'Hi! I can help you with CSC 648...',
    timestamp: '2 hours ago',
    unread: true,
    conversationId: 'conv-1' // Maps to conversation thread
  },
  {
    id: 2,
    from: 'Jordan Lee',
    preview: 'Thanks for reaching out. I\'m available...',
    timestamp: '1 day ago',
    unread: false,
    conversationId: 'conv-2' // Maps to conversation thread
  },
  {
    id: 3,
    from: 'Riley Chen',
    preview: 'Sure, let\'s schedule a session...',
    timestamp: '2 days ago',
    unread: false,
    conversationId: 'conv-3' // Maps to conversation thread
  },
];

// Mock tutor postings
export const MOCK_TUTOR_POSTINGS = [
  {
    id: 1,
    title: 'CSC 648 Tutor - Experienced TA',
    subjects: ['Computer Science'],
    courses: ['CSC 648', 'CSC 220'],
    rate: 25,
    status: 'active',
    views: 142,
    messages: 8,
    createdAt: '2025-01-15'
  },
  {
    id: 2,
    title: 'Mathematics Tutor - All Levels',
    subjects: ['Mathematics'],
    courses: ['MATH 226', 'MATH 227'],
    rate: 30,
    status: 'active',
    views: 89,
    messages: 5,
    createdAt: '2025-01-20'
  },
];

// Mock reviews summary
export const MOCK_REVIEWS_SUMMARY = {
  averageRating: 4.8,
  totalReviews: 24,
  breakdown: {
    5: 18,
    4: 5,
    3: 1,
    2: 0,
    1: 0
  }
};

// Mock inbox messages (one-way: student to tutor)
export const MOCK_INBOX_MESSAGES = [
  {
    id: 1,
    conversationId: 'conv-1',
    otherUser: {
      id: 2,
      name: 'Casey Smith',
      email: 'casey@sfsu.edu',
      avatar: null,
      isTutor: true
    },
    lastMessage: {
      text: 'Hi! I\'m interested in your CSC 648 tutoring services. You can reach me at my school email: student@sfsu.edu',
      timestamp: '2025-02-10T14:30:00Z',
      senderId: 1 // Current user (student) sent this
    },
    unreadCount: 0, // No unread since tutor can't reply
    tutorProfileId: 1
  },
  {
    id: 2,
    conversationId: 'conv-2',
    otherUser: {
      id: 3,
      name: 'Jordan Lee',
      email: 'jordan@sfsu.edu',
      avatar: null,
      isTutor: true
    },
    lastMessage: {
      text: 'Hello! I\'d like to schedule a tutoring session. Feel free to call or text me at (415) 555-0123',
      timestamp: '2025-02-09T10:15:00Z',
      senderId: 1 // Current user (student) sent this
    },
    unreadCount: 0,
    tutorProfileId: 2
  },
  {
    id: 3,
    conversationId: 'conv-3',
    otherUser: {
      id: 4,
      name: 'Riley Chen',
      email: 'riley@sfsu.edu',
      avatar: null,
      isTutor: true
    },
    lastMessage: {
      text: 'Hi there! I need help with data structures. My SFSU email is jsmith@sfsu.edu - you can email me there to coordinate.',
      timestamp: '2025-02-08T16:45:00Z',
      senderId: 1 // Current user (student) sent this
    },
    unreadCount: 0,
    tutorProfileId: 3
  },
  {
    id: 4,
    conversationId: 'conv-4',
    otherUser: {
      id: 5,
      name: 'Sam Johnson',
      email: 'sam@sfsu.edu',
      avatar: null,
      isTutor: true
    },
    lastMessage: {
      text: 'Hello! I have questions about the physics assignment. You can reach me at (415) 555-9876',
      timestamp: '2025-02-07T09:20:00Z',
      senderId: 1 // Current user (student) sent this
    },
    unreadCount: 0,
    tutorProfileId: 4
  },
];

// Mock conversation threads (one-way: only messages from student to tutor)
// Different threads for different tutors - each with one greeting message and contact info
export const MOCK_CONVERSATION_THREADS = {
  'conv-1': [ // Casey Smith
    {
      id: 1,
      senderId: 1,
      senderName: 'You (Student)',
      text: 'Hi! I\'m interested in your CSC 648 tutoring services. You can reach me at my school email: student@sfsu.edu',
      timestamp: '2025-02-10T14:30:00Z',
      isRead: true
    },
  ],
  'conv-2': [ // Jordan Lee
    {
      id: 1,
      senderId: 1,
      senderName: 'You (Student)',
      text: 'Hello! I\'d like to schedule a tutoring session. Feel free to call or text me at (415) 555-0123',
      timestamp: '2025-02-09T10:15:00Z',
      isRead: true
    },
  ],
  'conv-3': [ // Riley Chen
    {
      id: 1,
      senderId: 1,
      senderName: 'You (Student)',
      text: 'Hi there! I need help with data structures. My SFSU email is jsmith@sfsu.edu - you can email me there to coordinate.',
      timestamp: '2025-02-08T16:45:00Z',
      isRead: true
    },
  ],
  'conv-4': [ // Sam Johnson
    {
      id: 1,
      senderId: 1,
      senderName: 'You (Student)',
      text: 'Hello! I have questions about the physics assignment. You can reach me at (415) 555-9876',
      timestamp: '2025-02-07T09:20:00Z',
      isRead: true
    },
  ],
};

// Legacy export for backward compatibility
export const MOCK_CONVERSATION_THREAD = MOCK_CONVERSATION_THREADS['conv-1'];

// Mock subjects for posting form - Complete SFSU subjects list
export const MOCK_SUBJECTS = [
  // College of Science & Engineering
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
  
  // Lam Family College of Business
  { slug: 'business-administration', name: 'Business Administration' },
  { slug: 'accounting', name: 'Accounting' },
  { slug: 'economics', name: 'Economics' },
  { slug: 'finance', name: 'Finance' },
  { slug: 'management', name: 'Management' },
  { slug: 'marketing', name: 'Marketing' },
  { slug: 'information-systems', name: 'Information Systems' },
  
  // College of Health & Social Sciences
  { slug: 'psychology', name: 'Psychology' },
  { slug: 'sociology', name: 'Sociology' },
  { slug: 'social-work', name: 'Social Work' },
  { slug: 'criminal-justice', name: 'Criminal Justice' },
  { slug: 'kinesiology', name: 'Kinesiology' },
  { slug: 'nursing', name: 'Nursing' },
  { slug: 'public-health', name: 'Public Health' },
  
  // College of Liberal & Creative Arts
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
  
  // Graduate College of Education
  { slug: 'education', name: 'Education' },
  { slug: 'secondary-education', name: 'Secondary Education' },
  { slug: 'special-education', name: 'Special Education' },
  { slug: 'counseling', name: 'Counseling' },
  
  // College of Ethnic Studies
  { slug: 'asian-american-studies', name: 'Asian American Studies' },
  { slug: 'africana-studies', name: 'Africana Studies' },
  { slug: 'latina-latino-studies', name: 'Latina/Latino Studies' },
  { slug: 'american-indian-studies', name: 'American Indian Studies' },
  { slug: 'race-resistance-studies', name: 'Race and Resistance Studies' },
  
  // Foreign Languages
  { slug: 'spanish', name: 'Spanish' },
  { slug: 'french', name: 'French' },
  { slug: 'german', name: 'German' },
  { slug: 'italian', name: 'Italian' },
  { slug: 'japanese', name: 'Japanese' },
  { slug: 'chinese', name: 'Chinese' },
  { slug: 'arabic', name: 'Arabic' },
  { slug: 'portuguese', name: 'Portuguese' },
  
  // Other Departments
  { slug: 'humanities', name: 'Humanities' },
  { slug: 'anthropology', name: 'Anthropology' },
  { slug: 'geography', name: 'Geography' },
  { slug: 'linguistics', name: 'Linguistics' },
  { slug: 'womens-gender-studies', name: "Women's and Gender Studies" },
  { slug: 'urban-studies', name: 'Urban Studies' },
  { slug: 'international-relations', name: 'International Relations' },
  { slug: 'hospitality-tourism', name: 'Hospitality and Tourism' },
];

// Mock availability options
export const MOCK_AVAILABILITY = [
  'Monday Morning',
  'Monday Afternoon',
  'Monday Evening',
  'Tuesday Morning',
  'Tuesday Afternoon',
  'Tuesday Evening',
  'Wednesday Morning',
  'Wednesday Afternoon',
  'Wednesday Evening',
  'Thursday Morning',
  'Thursday Afternoon',
  'Thursday Evening',
  'Friday Morning',
  'Friday Afternoon',
  'Saturday Morning',
  'Saturday Afternoon',
  'Sunday Morning',
  'Sunday Afternoon',
];

