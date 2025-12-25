# P1 Features List - Feature Freeze

**Last Updated:** [Fill in date]  
**Milestone:** M3 → Final  
**Status:** Feature Freeze Active

This document defines the core features that MUST be implemented for the final project submission. Features are categorized by priority (P1 = MUST, P2/P3 = nice-to-haves).

---

## P1 (MUST HAVE) - Core Features for Demo/Final

These features are **required** for final grading and must be fully functional. The M3 vertical prototype demonstrates these features.

### 1. User Authentication & Authorization
- **Status:** ✅ Implemented (M3)
- **Description:** 
  - User registration with SFSU email validation (@sfsu.edu)
  - Secure password hashing using bcrypt (not plain text)
  - User login with password verification
  - Basic session management (localStorage for M3; JWT recommended for final)
- **Backend:** `POST /api/auth/register`, `POST /api/auth/login`
- **Frontend:** `/login`, `/register` pages
- **Database:** `users` table with `password_hash` column
- **Notes:** Passwords are hashed before storage. Email validation enforces @sfsu.edu requirement.

### 2. Tutor Search & Discovery (Vertical Slice Core)
- **Status:** ✅ Implemented (M3)
- **Description:**
  - Search tutors by keyword (name, course code, subject, bio)
  - Filter by subject category dropdown
  - Paginated search results
  - Display tutor cards with name, bio, subjects, courses, ratings
- **Backend:** `GET /api/search`, `GET /api/subjects`, `GET /api/categories`
- **Frontend:** Home page search bar, `/search` results page
- **Database:** Real MySQL queries on `tutor_profiles`, `subjects`, `courses`, `tutor_subjects`, `tutor_courses`
- **Notes:** Uses real database queries (not mock data). Only shows approved tutors.

### 3. Messaging System
- **Status:** ✅ Implemented (M3)
- **Description:**
  - Send messages from students to tutors
  - View message threads between two users
  - List all conversations for a user
  - Basic message threading support
- **Backend:** `POST /api/messages`, `GET /api/messages/thread`, `GET /api/messages/conversations`
- **Frontend:** `/messaging` page
- **Database:** `messages` table with real DB queries
- **Notes:** Full CRUD operations on messages. Threading via `parent_message_id`.

### 4. Dashboards (Basic)
- **Status:** ✅ Implemented (M3) - Partially with mock data
- **Description:**
  - **Tutee Dashboard:** View saved tutors, message history (currently shows mock data)
  - **Tutor Dashboard:** View incoming messages, profile status (currently shows mock data)
- **Backend:** Uses existing messaging and search APIs
- **Frontend:** `/dashboard/tutee`, `/dashboard/tutor` pages
- **Database:** Dashboard components exist; favorites/messages lists need API integration
- **Notes:** For final, wire up favorites API and conversations API to replace mock data.

### 5. SFSU-Specific Features
- **Status:** ✅ Implemented (M3)
- **Description:**
  - SFSU email validation (@sfsu.edu requirement)
  - Course code formatting (e.g., "CSC 648", "MATH 226")
  - SFSU branding (logo, purple/gold colors where applicable)
  - University-specific terminology
- **Backend:** Email validation in registration endpoint
- **Frontend:** SFSU branding throughout UI
- **Notes:** Core requirement for project context.

### 6. Responsive Design (Basic)
- **Status:** ✅ Partially Implemented
- **Description:**
  - Key pages work on mobile/tablet/desktop
  - Home, Search, Login, Register pages are responsive
  - Dashboard pages have mobile variants
- **Frontend:** CSS/Tailwind responsive classes, mobile dashboard components exist
- **Notes:** Should be tested on multiple screen sizes. Mobile dashboards may need refinement.

---

## P2 (SHOULD HAVE) - Secondary Features

These features enhance the user experience but are not strictly required for final demo.

### 1. Tutor Profile Detail Page
- **Status:** ⚠️ Not Implemented
- **Description:** Dedicated page showing full tutor profile with all courses, subjects, bio, ratings, reviews
- **Priority:** Medium
- **Notes:** Currently only shown in search results cards. Full profile page would improve UX.

### 2. Saved Tutors / Favorites
- **Status:** ⚠️ Not Implemented (DB table exists)
- **Description:** Allow students to save/favorite tutors for quick access
- **Backend:** `favorites` table exists; needs API endpoints
- **Priority:** Medium
- **Notes:** Would complete the tutee dashboard functionality.

### 3. Review System
- **Status:** ⚠️ Not Implemented (DB table exists)
- **Description:** Students can leave reviews and ratings for tutors
- **Backend:** `reviews` table exists; needs API endpoints
- **Priority:** Medium
- **Notes:** Important for trust and tutor selection.

### 4. Tutor Registration Workflow
- **Status:** ⚠️ Partially Implemented
- **Description:** Complete tutor registration with subject/course selection and profile creation
- **Backend:** User registration works; tutor profile creation workflow incomplete
- **Priority:** Medium
- **Notes:** Frontend form exists; needs full backend integration.

### 5. Advanced Search Filters
- **Status:** ❌ Not Implemented
- **Description:** Filter by tutoring format (in-person/online/hybrid), rating, sort options
- **Priority:** Low
- **Notes:** Nice enhancement but basic search is sufficient for P1.

---

## P3 (NICE TO HAVE) - Enhancement Features

These features would be nice additions but are not required.

### 1. Session Scheduling
- **Status:** ❌ Not Implemented (DB table exists, marked for M4)
- **Description:** Book tutoring sessions, calendar integration, session reminders
- **Priority:** Low
- **Notes:** Explicitly deferred to M4 in migration file.

### 2. Email Notifications
- **Status:** ❌ Not Implemented
- **Description:** Email alerts for messages, session reminders, etc.
- **Priority:** Low
- **Notes:** Nice to have but not critical for demo.

### 3. Admin Dashboard
- **Status:** ❌ Not Implemented (DB tables exist)
- **Description:** Admin interface for approving tutors, moderating content, viewing reports
- **Priority:** Low
- **Notes:** Useful for production but not required for demo.

### 4. Payment Integration
- **Status:** ❌ Not Implemented
- **Description:** Payment processing, transaction history, pricing management
- **Priority:** Low
- **Notes:** Out of scope for this project.

### 5. Advanced Analytics
- **Status:** ❌ Not Implemented
- **Description:** Usage statistics, popular courses, tutor performance metrics
- **Priority:** Low
- **Notes:** Future enhancement.

---

## M3 Vertical Slice Summary

The M3 demo showcases the following **working features** (all P1):

1. ✅ **Home Page** - Search interface with category dropdown
2. ✅ **Search Results** - Real database queries, pagination, filters
3. ✅ **User Registration** - SFSU email validation, password hashing
4. ✅ **User Login** - Password verification, session management
5. ✅ **Messaging** - Send messages, view threads, conversations
6. ✅ **Dashboards** - Tutee and Tutor dashboards (with some mock data)

**All core P1 features are functional and backed by real database queries.**

---

## Feature Status Legend

- ✅ **Implemented** - Feature is complete and functional
- ⚠️ **Partially Implemented** - Feature exists but needs work
- ❌ **Not Implemented** - Feature has not been started

---

## Notes

- **Feature Freeze Date:** [Fill in date after M3 meeting]
- **Final Submission Date:** [Fill in date]
- **Focus for Final:** Ensure all P1 features are fully functional, tested, and polished
- **P2/P3 Features:** Can be added if time permits, but P1 must be complete first

---

## Updates Log

- **[Date]:** Initial feature freeze list created (M3)
- **[Date]:** [Add updates as features are completed or priorities change after M3 meeting]
