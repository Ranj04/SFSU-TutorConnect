# Milestone 3 Implementation Summary

**Date:** [Fill in date]  
**Team:** CSC 648 Team 02  
**Status:** ✅ Vertical Prototype Complete

---

## Executive Summary

**✅ Fully Implemented (Real DB):**
- User authentication (registration/login with bcrypt password hashing)
- Tutor search with real database queries (subjects, courses, text search)
- Messaging system (send messages, view threads, conversations)
- All core entities backed by MySQL database

**⚠️ Partially Implemented (Mock Data):**
- Dashboards display hardcoded data (saved tutors, message lists)
- Tutor registration form exists but backend workflow incomplete

**❌ Not Implemented (Tables Exist, No API):**
- Reviews, Favorites, Availability, Tutor Applications
- Sessions, Reports, Notifications, Media, Admin Actions (some marked for M4)

**📋 Deviations from EER:**
- Two-table approach for tutor-course relationships (applications vs active)
- Message threading support added
- Single users table with role flags (vs separate user types)
- Verification workflow for tutor profiles

---

## 1. What is Implemented in the Vertical Prototype

The vertical prototype includes the following functional features that are deployed and accessible from the production URL (sfsututor.site):

### Frontend Pages (All Implemented)
- ✅ **Home Page** (`/`) - Search interface with category dropdown
- ✅ **Search Results Page** (`/search`) - Displays tutor search results with pagination
- ✅ **Login Page** (`/login`) - User authentication form
- ✅ **Registration Page** (`/register`) - New user account creation
- ✅ **Messaging Page** (`/messaging`) - Tutor-student message threads
- ✅ **Tutee Dashboard** (`/dashboard/tutee`) - Student dashboard with saved tutors and messages
- ✅ **Tutor Dashboard** (`/dashboard/tutor`) - Tutor dashboard with incoming messages

### Backend API Endpoints (All Implemented)
- ✅ `GET /api/search` - Search tutors with filters (category, text query, pagination)
- ✅ `GET /api/subjects` - Get all available subjects for dropdown
- ✅ `GET /api/categories` - Alias for subjects endpoint
- ✅ `POST /api/auth/register` - User registration with password hashing
- ✅ `POST /api/auth/login` - User authentication
- ✅ `POST /api/messages` - Send messages between users
- ✅ `GET /api/messages/conversations` - Get all conversations for a user
- ✅ `GET /api/messages/thread` - Get message thread between two users

### Core Functionality
- ✅ **Search Flow**: Home → Search → Results (end-to-end working)
- ✅ **Authentication Flow**: Register/Login → Dashboard redirect
- ✅ **Messaging Flow**: Search → View Tutor → Send Message → View Thread
- ✅ **Password Security**: All passwords hashed with bcrypt (not stored in plain text)
- ✅ **SFSU Email Validation**: Registration requires @sfsu.edu email addresses

---

## 2. Entities/Features Backed by Real Database

The following database tables and features are **fully implemented** with real database queries (not mock data):

### Core Entities (✅ Fully Implemented)

1. **Users Table** (`users`)
   - ✅ User registration creates real database records
   - ✅ User login queries real database
   - ✅ Password hashing stored in `password_hash` column
   - ✅ SFSU email validation enforced
   - ✅ User roles (student/tutor/admin) stored and used
   - **API Endpoints**: `POST /api/auth/register`, `POST /api/auth/login`

2. **Tutor Profiles Table** (`tutor_profiles`)
   - ✅ Search queries real tutor profiles from database
   - ✅ Only approved tutors (`verification_status = 'approved'`) appear in search
   - ✅ Tutor bio, ratings, review counts from database
   - ✅ Relationships to users, subjects, and courses loaded
   - **API Endpoints**: `GET /api/search` (returns tutor profiles)

3. **Subjects Table** (`subjects`)
   - ✅ Category dropdown populated from real database
   - ✅ Subject filtering in search uses real database queries
   - ✅ Subject slugs used for URL-friendly filtering
   - **API Endpoints**: `GET /api/subjects`, `GET /api/categories`

4. **Courses Table** (`courses`)
   - ✅ Course information included in search results
   - ✅ Course codes (e.g., "CSC 648") searchable
   - ✅ Course titles and descriptions searchable
   - ✅ Linked to tutors via `tutor_courses` junction table
   - **API Endpoints**: `GET /api/search` (includes courses in results)

5. **Tutor Subjects Junction Table** (`tutor_subjects`)
   - ✅ Many-to-many relationship between tutors and subjects
   - ✅ Used for subject-based filtering in search
   - ✅ Loaded in search results

6. **Tutor Courses Junction Table** (`tutor_courses`)
   - ✅ Many-to-many relationship between tutors and courses
   - ✅ Course qualifications stored per tutor-course pair
   - ✅ Used in search to find tutors by course

7. **Messages Table** (`messages`)
   - ✅ Message sending creates real database records
   - ✅ Message threads queried from database
   - ✅ Conversation lists generated from database
   - ✅ Message threading (parent-child relationships) supported
   - ✅ Read/unread status tracked
   - **API Endpoints**: `POST /api/messages`, `GET /api/messages/conversations`, `GET /api/messages/thread`

### Search Implementation Details
- ✅ **Real Database Queries**: Search uses SQLAlchemy ORM with actual MySQL queries
- ✅ **Text Search**: SQL LIKE queries across tutor names, bios, course codes, course titles, and descriptions
- ✅ **Subject Filtering**: JOIN queries on `tutor_subjects` and `subjects` tables
- ✅ **Pagination**: Database-level pagination using LIMIT/OFFSET
- ✅ **Eager Loading**: Optimized queries with `joinedload()` to prevent N+1 queries

---

## 3. What's Still Mocked or Not Implemented

The following features have database tables but **no backend API implementation** or are using **mock/hardcoded data**:

### Database Tables Without API Implementation

1. **Reviews Table** (`reviews`)
   - ❌ **Status**: Table exists in database, but no API endpoints
   - ❌ **Frontend**: Review display may show data from search results, but no create/update endpoints
   - **Missing**: `POST /api/reviews`, `GET /api/tutors/:id/reviews`, `PUT /api/reviews/:id`

2. **Favorites Table** (`favorites`)
   - ❌ **Status**: Table exists in database, but no API endpoints
   - ❌ **Frontend**: Tutee dashboard shows hardcoded saved tutors array
   - **Missing**: `POST /api/favorites`, `GET /api/favorites`, `DELETE /api/favorites/:id`

3. **Tutor Availability Table** (`tutor_availability`)
   - ❌ **Status**: Table exists in database, but no API endpoints
   - ❌ **Frontend**: Not displayed anywhere
   - **Missing**: `GET /api/tutors/:id/availability`, `POST /api/tutors/:id/availability`

4. **Tutor Course Applications Table** (`tutor_course_applications`)
   - ❌ **Status**: Table exists in database, but no API endpoints
   - ❌ **Frontend**: Tutor registration form exists but may not be fully wired
   - **Missing**: `POST /api/tutor-applications`, `GET /api/tutor-applications`, admin approval endpoints

5. **Tutoring Sessions Table** (`tutoring_sessions` - from migration 010)
   - ❌ **Status**: Table exists in database, but no API endpoints
   - ❌ **Frontend**: Not implemented
   - ⚠️ **Note**: Marked as "DEFERRED TO M4" in migration file
   - **Missing**: Session booking, scheduling endpoints

6. **Reports Table** (`reports`)
   - ❌ **Status**: Table exists in database, but no API endpoints
   - ❌ **Frontend**: Not implemented
   - **Missing**: Report submission, admin moderation endpoints

7. **Notifications Tables** (`notifications`, `notification_preferences` - from migrations 011, 012)
   - ❌ **Status**: Tables exist in database, but no API endpoints
   - ❌ **Frontend**: Not implemented
   - ⚠️ **Note**: Marked as "DEFERRED TO M4" in migration file
   - **Missing**: Notification creation, user preferences, notification delivery

8. **Media Assets Table** (`media_assets` - from migration 008)
   - ❌ **Status**: Table exists in database, but no API endpoints
   - ❌ **Frontend**: Not implemented
   - **Missing**: File upload, media management endpoints

9. **Admin Actions Table** (`admin_actions` - from migration 009)
   - ❌ **Status**: Table exists in database, but no API endpoints
   - ❌ **Frontend**: Not implemented
   - **Missing**: Admin dashboard, action logging endpoints

### Frontend Components Using Mock Data

1. **Tutee Dashboard** (`TuteeDashboardOverviewFrame.tsx`)
   - ❌ **Saved Tutors**: Hardcoded array `savedTutors` (lines 17-22)
   - ❌ **Messages List**: Hardcoded array `messages` (lines 24-27)
   - **Needs**: API calls to `GET /api/favorites` and `GET /api/messages/conversations`

2. **Tutor Dashboard** (`TutorDashboardOverviewFrame.tsx`)
   - ❌ **Inbox Messages**: Hardcoded array `messages` (lines 14-20)
   - **Needs**: API call to `GET /api/messages/conversations` filtered by recipient

3. **Search Results Frame** (`SearchResultsFrame.tsx`)
   - ❌ **Mock Tutors**: Component has `mockTutors` array (line 30)
   - ✅ **Note**: The actual `/search` route uses `SearchResults.jsx` which calls real API

### Partially Implemented Features

1. **Tutor Registration**
   - ⚠️ **Status**: Frontend form exists (`TutorRegistrationFrame.tsx`, `LazyRegistrationFrame.tsx`)
   - ⚠️ **Backend**: User registration supports `is_tutor` flag, but tutor profile creation workflow incomplete
   - ⚠️ **Missing**: 
     - Subject selection API integration
     - Course selection API integration
     - Tutor profile creation endpoint
     - Tutor course application submission

2. **Tutor Profile Display**
   - ⚠️ **Status**: Basic tutor info shown in search results
   - ⚠️ **Missing**: 
     - Dedicated tutor profile detail page
     - Full profile view with all courses, subjects, availability
     - Profile editing for tutors

3. **Authentication**
   - ⚠️ **Status**: Login/registration work, but session management is basic
   - ⚠️ **Missing**:
     - JWT token-based authentication (currently using localStorage)
     - Password reset functionality
     - Email verification
     - Session expiration handling

---

## 4. Deviations from EER Diagram

### Database Schema Deviations

Based on the migration files, the following deviations or notes should be documented:

1. **Tutor Course Applications vs Tutor Courses**
   - **EER Design**: May have had a single tutor-course relationship
   - **Implementation**: Two separate tables:
     - `tutor_course_applications` - Application workflow (pending/approved/rejected)
     - `tutor_courses` - Active tutor-course relationships (after approval)
   - **Rationale**: Supports application/review workflow before tutors are approved for courses

2. **Message Threading**
   - **EER Design**: May have been simpler message structure
   - **Implementation**: Supports `parent_message_id` for threaded conversations
   - **Rationale**: Enables reply chains and conversation threading

3. **User Roles**
   - **EER Design**: May have had separate user types
   - **Implementation**: Single `users` table with boolean flags (`is_student`, `is_tutor`, `is_admin`)
   - **Rationale**: Users can have multiple roles (e.g., student who is also a tutor)

4. **Verification Status**
   - **EER Design**: May not have specified verification workflow
   - **Implementation**: `tutor_profiles.verification_status` enum (pending/approved/rejected)
   - **Rationale**: Admin approval workflow for tutor profiles

5. **Soft Deletes**
   - **EER Design**: May not have specified soft delete strategy
   - **Implementation**: Some tables use `deleted_at` (e.g., `tutor_course_applications`)
   - **Rationale**: Allows data recovery and audit trails

### API Design Deviations

1. **Search Endpoint Design**
   - **EER Design**: May have specified separate endpoints
   - **Implementation**: Single `/api/search` endpoint with query parameters
   - **Rationale**: Flexible filtering without multiple endpoints

2. **Authentication Design**
   - **EER Design**: May have specified OAuth/SSO
   - **Implementation**: Email/password authentication only
   - **Rationale**: M3 scope - SSO can be added later

3. **Messaging Design**
   - **EER Design**: May have specified real-time messaging
   - **Implementation**: REST API with polling (no WebSockets)
   - **Rationale**: M3 scope - real-time can be added later

---

## Summary Table

| Feature/Entity | Database Table | Backend API | Frontend | Status |
|----------------|----------------|-------------|----------|--------|
| User Registration | ✅ `users` | ✅ Implemented | ✅ Implemented | **Complete** |
| User Login | ✅ `users` | ✅ Implemented | ✅ Implemented | **Complete** |
| Tutor Search | ✅ `tutor_profiles` | ✅ Implemented | ✅ Implemented | **Complete** |
| Subject Filtering | ✅ `subjects` | ✅ Implemented | ✅ Implemented | **Complete** |
| Course Search | ✅ `courses` | ✅ Implemented | ✅ Implemented | **Complete** |
| Messaging | ✅ `messages` | ✅ Implemented | ✅ Implemented | **Complete** |
| Reviews | ✅ `reviews` | ❌ Not Implemented | ❌ Not Implemented | **DB Only** |
| Favorites | ✅ `favorites` | ❌ Not Implemented | ⚠️ Mock Data | **DB Only** |
| Availability | ✅ `tutor_availability` | ❌ Not Implemented | ❌ Not Implemented | **DB Only** |
| Tutor Applications | ✅ `tutor_course_applications` | ❌ Not Implemented | ⚠️ Partial | **DB Only** |
| Tutoring Sessions | ✅ `tutoring_sessions` | ❌ Not Implemented | ❌ Not Implemented | **DB Only (M4)** |
| Reports | ✅ `reports` | ❌ Not Implemented | ❌ Not Implemented | **DB Only** |
| Notifications | ✅ `notifications` | ❌ Not Implemented | ❌ Not Implemented | **DB Only (M4)** |
| Media Assets | ✅ `media_assets` | ❌ Not Implemented | ❌ Not Implemented | **DB Only** |
| Admin Actions | ✅ `admin_actions` | ❌ Not Implemented | ❌ Not Implemented | **DB Only** |

---

## Notes for M3 Review

### ✅ Fully Working (Real DB Integration)
1. **Search is fully functional** with real database queries - this is the core vertical prototype feature
2. **Authentication works** with real password hashing and database storage
3. **Messaging works** with real database storage and retrieval
4. **All core entities** (Users, Tutor Profiles, Subjects, Courses, Messages) are backed by real database queries

### ⚠️ Partially Working (Mock Data or Incomplete)
5. **Dashboards exist** but use mock data for saved tutors and message lists - these need API integration
6. **Tutor registration form exists** but may need backend integration for full workflow

### 📋 Future Work (Tables Exist, Not Yet Used)
7. **Many database tables exist** but are not yet used by the application - these are for future milestones (M4+)
8. **Some tables explicitly marked for M4** in migration comments (tutoring_sessions, notifications)

---

## Next Steps (Post-M3)

1. **High Priority**: Wire up favorites API for tutee dashboard
2. **High Priority**: Wire up conversations API for both dashboards
3. **Medium Priority**: Complete tutor registration backend workflow
4. **Medium Priority**: Implement reviews system
5. **Low Priority**: Add remaining features (sessions, notifications, etc.)
