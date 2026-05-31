-- ============================================================================
-- TutorConnect Demo Data Seeding (M3 Production-Ready)
-- ============================================================================
-- This file seeds demo data for the M3 vertical prototype.
-- 
-- M3 CORE DATA (Always seeded):
--   - 1 admin user
--   - 8 approved tutors
--   - 5 student users
--   - Tutor profiles with ratings
--   - Subject and course mappings
--   - Sample favorites, reviews, and messages
--
-- PASSWORD SECURITY:
--   All demo users have bcrypt-hashed passwords (password: "password123")
--   To generate new hashes: python generate_hash.py 'your_password'
--   Hash format: bcrypt with work factor 12
--
-- OPTIONAL DATA (Commented out by default):
--   - tutor_availability (uncomment if you ran 004_availability.sql)
--   - tutoring_sessions (uncomment if you ran 010_sessions.sql)
--   - notifications (uncomment if you ran 011_notifications.sql)
--   - notification_preferences (uncomment if you ran 012_notification_preferences.sql)
--
-- To enable optional data: Remove /* */ comment blocks for desired sections
-- ============================================================================

-- Demo users: Basic accounts without role distinctions
-- All passwords are hashed with bcrypt (plaintext: "password123")
-- Hash generated with: python -c "import bcrypt print(bcrypt.hashpw(b'password123', bcrypt.gensalt()).decode())"
-- (Split command to avoid SQL parser issues with semicolons in comments)
INSERT INTO users (email, password_hash, first_name, last_name, profile_photo_url, major, account_status)
VALUES
('admin@sfsu.edu', '$2b$12$BB9vvz2DEU8rpDEM8zNwHuTgUq.JBARdREOmYsEFYQAD12hyh/eay', 'Admin', 'One', NULL, NULL, 'active'),
('tutor1@sfsu.edu', '$2b$12$BB9vvz2DEU8rpDEM8zNwHuTgUq.JBARdREOmYsEFYQAD12hyh/eay', 'Casey', 'Smith', 'https://example.com/photos/casey.jpg', 'Computer Science', 'active'),
('tutor2@sfsu.edu', '$2b$12$BB9vvz2DEU8rpDEM8zNwHuTgUq.JBARdREOmYsEFYQAD12hyh/eay', 'Jordan', 'Lee', 'https://example.com/photos/jordan.jpg', 'Mathematics', 'active'),
('tutor3@sfsu.edu', '$2b$12$BB9vvz2DEU8rpDEM8zNwHuTgUq.JBARdREOmYsEFYQAD12hyh/eay', 'Riley', 'Chen', 'https://example.com/photos/riley.jpg', 'Computer Science', 'active'),
('tutor4@sfsu.edu', '$2b$12$BB9vvz2DEU8rpDEM8zNwHuTgUq.JBARdREOmYsEFYQAD12hyh/eay', 'Sam', 'Johnson', 'https://example.com/photos/sam.jpg', 'Physics', 'active'),
('tutor5@sfsu.edu', '$2b$12$BB9vvz2DEU8rpDEM8zNwHuTgUq.JBARdREOmYsEFYQAD12hyh/eay', 'Dakota', 'Williams', 'https://example.com/photos/dakota.jpg', 'Chemistry', 'active'),
('tutor6@sfsu.edu', '$2b$12$BB9vvz2DEU8rpDEM8zNwHuTgUq.JBARdREOmYsEFYQAD12hyh/eay', 'Morgan', 'Brown', 'https://example.com/photos/morgan.jpg', 'Biology', 'active'),
('tutor7@sfsu.edu', '$2b$12$BB9vvz2DEU8rpDEM8zNwHuTgUq.JBARdREOmYsEFYQAD12hyh/eay', 'Avery', 'Martinez', 'https://example.com/photos/avery.jpg', 'Mathematics', 'active'),
('tutor8@sfsu.edu', '$2b$12$BB9vvz2DEU8rpDEM8zNwHuTgUq.JBARdREOmYsEFYQAD12hyh/eay', 'Quinn', 'Garcia', 'https://example.com/photos/quinn.jpg', 'Physics', 'active'),
('student1@sfsu.edu', '$2b$12$BB9vvz2DEU8rpDEM8zNwHuTgUq.JBARdREOmYsEFYQAD12hyh/eay', 'Alex', 'Student', 'https://example.com/photos/alex.jpg', 'Computer Science', 'active'),
('student2@sfsu.edu', '$2b$12$BB9vvz2DEU8rpDEM8zNwHuTgUq.JBARdREOmYsEFYQAD12hyh/eay', 'Taylor', 'Student', 'https://example.com/photos/taylor.jpg', 'Business Administration', 'active'),
('student3@sfsu.edu', '$2b$12$BB9vvz2DEU8rpDEM8zNwHuTgUq.JBARdREOmYsEFYQAD12hyh/eay', 'Morgan', 'Student', 'https://example.com/photos/morgan2.jpg', 'Computer Science', 'active'),
('student4@sfsu.edu', '$2b$12$BB9vvz2DEU8rpDEM8zNwHuTgUq.JBARdREOmYsEFYQAD12hyh/eay', 'Jamie', 'Student', NULL, 'Biology', 'active'),
('student5@sfsu.edu', '$2b$12$BB9vvz2DEU8rpDEM8zNwHuTgUq.JBARdREOmYsEFYQAD12hyh/eay', 'Avery', 'Student', NULL, 'Physics', 'active');

-- Tutor profiles (approved by admin)
-- User profiles (formerly tutor profiles)
INSERT INTO user_profiles (user_id, bio, preferred_meeting_modes, preferred_meeting_location, overall_avg_rating, overall_review_count)
VALUES
((SELECT id FROM users WHERE email='tutor1@sfsu.edu'), 'I tutor multiple SFSU courses and focus on fundamentals. I have experience as a TA and love helping students understand core concepts.', 'hybrid', 'SFSU Library or Zoom', 4.5, 3),
((SELECT id FROM users WHERE email='tutor2@sfsu.edu'), 'Specializing in calculus and statistics, available online. Math expert with a passion for making complex topics simple.', 'online', 'Zoom meetings', 4.8, 5),
((SELECT id FROM users WHERE email='tutor3@sfsu.edu'), 'Hands-on coding help, preferably in person. I love pair programming and helping students debug their code step by step.', 'in_person', 'SCI Building Room 301', 4.2, 2),
((SELECT id FROM users WHERE email='tutor4@sfsu.edu'), 'Physics PhD student with 5 years of tutoring experience. I specialize in mechanics, electromagnetism, and quantum physics. Can explain complex concepts clearly.', 'hybrid', 'Thornton Hall or Zoom', 4.7, 8),
((SELECT id FROM users WHERE email='tutor5@sfsu.edu'), 'Chemistry tutor specializing in organic chemistry and lab techniques. Former lab assistant with hands-on experience. Available for both theoretical and practical help.', 'in_person', 'Science Building Chemistry Lab', 4.6, 6),
((SELECT id FROM users WHERE email='tutor6@sfsu.edu'), 'Biology major with a focus on molecular biology and genetics. I have TA experience and can help with lab reports, exam prep, and understanding complex biological systems.', 'hybrid', 'Hensill Hall or Online', 4.4, 4),
((SELECT id FROM users WHERE email='tutor7@sfsu.edu'), 'Graduate student in Applied Mathematics. Expert in linear algebra, differential equations, and discrete math. Patient and thorough teaching style.', 'online', 'Zoom or Google Meet', 4.9, 12),
((SELECT id FROM users WHERE email='tutor8@sfsu.edu'), 'Astrophysics enthusiast with strong foundations in classical and modern physics. Love helping students develop intuition for physics problems and concepts.', 'hybrid', 'Thornton Hall or Zoom', 4.3, 5);


-- ============================================================================
-- Postings: Demo tutoring postings (mix of approved and pending)
-- ============================================================================
INSERT INTO postings (user_id, course_id, title, description, status, availability_notes, avg_rating, review_count)
VALUES
-- Approved postings
((SELECT id FROM users WHERE email='tutor1@sfsu.edu'), 
 (SELECT id FROM courses WHERE department='CSC' AND course_number='340'), 
 'CSC 340 Tutoring - Programming Methodology', 
 'I can help you master object-oriented design patterns and Java programming. 2 years of TA experience. Available for code reviews and project assistance.',
 'approved', 
 'Mon-Wed 1-3pm, Library or Zoom', 
 4.5, 2),

((SELECT id FROM users WHERE email='tutor1@sfsu.edu'), 
 (SELECT id FROM courses WHERE department='CSC' AND course_number='220'), 
 'CSC 220 Data Structures Help', 
 'Get help with arrays, linked lists, stacks, queues, trees, and graphs. I focus on algorithm complexity and efficiency.',
 'approved', 
 'Tue-Thu 2-4pm, SCI Building', 
 4.3, 1),

((SELECT id FROM users WHERE email='tutor2@sfsu.edu'), 
 (SELECT id FROM courses WHERE department='MATH' AND course_number='226'), 
 'Calculus I Tutoring - All Topics', 
 'Expert in calculus with focus on making complex topics simple. Specializing in limits, derivatives, and applications.',
 'approved', 
 'Online via Zoom, flexible hours', 
 4.8, 3),

((SELECT id FROM users WHERE email='tutor3@sfsu.edu'), 
 (SELECT id FROM courses WHERE department='CSC' AND course_number='648'), 
 'CSC 648 Software Engineering Project Help', 
 'Full-stack development tutoring for your team project. React, Node.js, MySQL, Git. Pair programming and debugging sessions available.',
 'approved', 
 'In-person, SCI 301, afternoons', 
 4.2, 1),

((SELECT id FROM users WHERE email='tutor4@sfsu.edu'), 
 (SELECT id FROM courses WHERE department='PHYS' AND course_number='220'), 
 'General Physics I - Mechanics & Thermodynamics', 
 'PhD student offering tutoring in classical mechanics, energy, momentum, and thermodynamics. Clear explanations guaranteed!',
 'approved', 
 'Thornton Hall or Zoom, weekends', 
 4.7, 4),

-- Pending postings (for approval demo)
((SELECT id FROM users WHERE email='tutor5@sfsu.edu'), 
 (SELECT id FROM courses WHERE department='CHEM' AND course_number='115'), 
 'General Chemistry Tutoring', 
 'Chemistry lab assistant offering help with atomic structure, bonding, stoichiometry, and lab techniques.',
 'pending', 
 'Science Building, Mon/Wed evenings', 
 NULL, 0),

((SELECT id FROM users WHERE email='student1@sfsu.edu'), 
 (SELECT id FROM courses WHERE department='CSC' AND course_number='317'), 
 'Web Development Tutoring - HTML/CSS/JavaScript', 
 'Student who aced CSC 317 offering tutoring for current students. Specializing in responsive design and modern frameworks.',
 'pending', 
 'Library, flexible schedule', 
 NULL, 0);

-- ============================================================================
-- Favorites: Students favoriting postings
-- ============================================================================
INSERT INTO favorites (student_user_id, posting_id)
SELECT 
  (SELECT id FROM users WHERE email='student1@sfsu.edu'),
  p.id
FROM postings p
JOIN users u ON p.user_id = u.id
WHERE u.email='tutor1@sfsu.edu' AND p.status='approved'
LIMIT 2;

INSERT INTO favorites (student_user_id, posting_id)
SELECT 
  (SELECT id FROM users WHERE email='student2@sfsu.edu'),
  p.id
FROM postings p
JOIN users u ON p.user_id = u.id
WHERE u.email='tutor2@sfsu.edu' AND p.status='approved'
LIMIT 1;

-- ============================================================================
-- Reviews: Polymorphic reviews for postings
-- ============================================================================
INSERT INTO reviews (reviewer_user_id, target_type, target_id, rating, comment, is_approved)
SELECT 
  (SELECT id FROM users WHERE email='student1@sfsu.edu'),
  'posting',
  p.id,
  5,
  'Great help with CSC 340! Very patient and explains concepts clearly.',
  TRUE
FROM postings p
JOIN users u ON p.user_id = u.id
JOIN courses c ON p.course_id = c.id
WHERE u.email='tutor1@sfsu.edu' AND c.course_number='340';

INSERT INTO reviews (reviewer_user_id, target_type, target_id, rating, comment, is_approved)
SELECT 
  (SELECT id FROM users WHERE email='student2@sfsu.edu'),
  'posting',
  p.id,
  5,
  'Excellent calculus tutor! Made derivatives so much easier to understand.',
  TRUE
FROM postings p
JOIN users u ON p.user_id = u.id
JOIN courses c ON p.course_id = c.id
WHERE u.email='tutor2@sfsu.edu' AND c.course_number='226';

INSERT INTO reviews (reviewer_user_id, target_type, target_id, rating, comment, is_approved)
SELECT 
  (SELECT id FROM users WHERE email='student3@sfsu.edu'),
  'posting',
  p.id,
  4,
  'Good physics tutoring. Helped me understand momentum and energy concepts.',
  TRUE
FROM postings p
JOIN users u ON p.user_id = u.id
JOIN courses c ON p.course_id = c.id
WHERE u.email='tutor4@sfsu.edu' AND c.course_number='220';

-- ============================================================================
-- Messages: With posting context
-- ============================================================================
INSERT INTO messages (sender_user_id, recipient_user_id, posting_id, posting_title_snapshot, message_text, is_read)
SELECT 
  (SELECT id FROM users WHERE email='student2@sfsu.edu'),
  p.user_id,
  p.id,
  p.title,
  'Hi! I saw your posting for CSC 340. Are you available this week to review recursion?',
  FALSE
FROM postings p
JOIN users u ON p.user_id = u.id
JOIN courses c ON p.course_id = c.id
WHERE u.email='tutor1@sfsu.edu' AND c.course_number='340';

INSERT INTO messages (sender_user_id, recipient_user_id, posting_id, posting_title_snapshot, message_text, is_read)
SELECT 
  (SELECT id FROM users WHERE email='student3@sfsu.edu'),
  p.user_id,
  p.id,
  p.title,
  'Can you help with the CSC 648 project setup? Our team is struggling with the database connection.',
  TRUE
FROM postings p
JOIN users u ON p.user_id = u.id
JOIN courses c ON p.course_id = c.id
WHERE u.email='tutor3@sfsu.edu' AND c.course_number='648';

-- Reply to the above message
INSERT INTO messages (sender_user_id, recipient_user_id, posting_id, posting_title_snapshot, message_text, is_read, parent_message_id)
SELECT 
  p.user_id,
  (SELECT id FROM users WHERE email='student3@sfsu.edu'),
  p.id,
  p.title,
  'Yes, I can meet Friday at 2pm in SCI 301. Bring your laptops!',
  TRUE,
  (SELECT id FROM messages 
   WHERE sender_user_id = (SELECT id FROM users WHERE email='student3@sfsu.edu') 
   AND recipient_user_id = p.user_id 
   LIMIT 1)
FROM postings p
JOIN users u ON p.user_id = u.id
JOIN courses c ON p.course_id = c.id
WHERE u.email='tutor3@sfsu.edu' AND c.course_number='648';

