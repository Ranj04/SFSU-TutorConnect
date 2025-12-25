# UI-Only Pages Implementation Summary

## Overview
This document describes the UI-only pages implemented for Milestone 3. All pages use mock data and do not connect to the backend API. All API integration points are marked with `// TODO: CONNECT_API_LATER`.

## Implemented Pages

### 1. Login (`/login`)
- **File**: `src/pages/Login.jsx`
- **Features**:
  - Email and password fields with inline validation
  - "Remember me" checkbox
  - @sfsu.edu email hint (shows green checkmark when SFSU email detected)
  - Mock login that stores user in localStorage
  - Accessible form with ARIA labels and error messages
- **Mock Behavior**: Simulates 500ms API delay, then redirects to `/dashboard`

### 2. Registration (`/register`)
- **File**: `src/pages/Register.jsx`
- **Features**:
  - First name, last name, SFSU email, password, confirm password fields
  - Role selection (Student/Tutor) with radio buttons
  - Terms of Service checkbox
  - SFSU Email Hint component (green hint when @sfsu.edu detected)
  - Inline validation with error messages
  - Accessible form with ARIA labels
- **Mock Behavior**: Simulates 500ms API delay, then redirects to `/dashboard`

### 3. Dashboard (`/dashboard`)
- **File**: `src/pages/Dashboard.jsx`
- **Features**:
  - Tab navigation between Student and Tutor views
  - **Student View**:
    - Upcoming Sessions widget (mock sessions)
    - Saved Tutors widget (mock tutor cards)
    - Recent Messages preview (last 3 messages)
  - **Tutor View**:
    - Quick stats (Total Views, Messages, Active Postings)
    - Reviews Summary with star ratings and breakdown
    - My Postings list with edit links
  - Tab selection persisted in sessionStorage
- **Mock Data**: Uses `MOCK_UPCOMING_SESSIONS`, `MOCK_SAVED_TUTORS`, `MOCK_MESSAGES_PREVIEW`, `MOCK_TUTOR_POSTINGS`, `MOCK_REVIEWS_SUMMARY`

### 4. Posting (`/post`)
- **File**: `src/pages/Posting.jsx`
- **Features**:
  - Create/Edit tutor posting form
  - Form fields:
    - Title (required)
    - Subjects (multi-select checkboxes)
    - SFSU Courses (Course Quick-Pick component)
    - Rate per hour (required)
    - Bio/Description (required, min 50 chars)
    - Availability (clickable chips)
    - Image upload (placeholder, disabled)
  - Live preview panel on the right that updates as you type
  - Inline validation
- **Mock Behavior**: Simulates save, then redirects to `/dashboard`
- **SFSU Feature**: Course Quick-Pick component with searchable dropdown

### 5. Messages (`/messages`)
- **File**: `src/pages/Messages.jsx`
- **Features**:
  - Two-pane layout:
    - **Left**: Inbox list with:
      - Search bar
      - Unread badge count
      - Conversation list with avatars, names, previews, timestamps
      - Pagination (8 messages per page)
    - **Right**: Conversation thread with:
      - Conversation header with user info
      - Message bubbles (sent/received styling)
      - Message composer (textarea + Send button - disabled with note)
  - Empty states for "no messages" and "no conversation selected"
  - Responsive layout
- **Mock Data**: Uses `MOCK_INBOX_MESSAGES` and `MOCK_CONVERSATION_THREAD`

## SFSU-Specific Features

### Course Quick-Pick Component
- **File**: `src/components/UI/CourseQuickPick.jsx`
- **Features**:
  - Searchable dropdown with SFSU course codes
  - Multi-select with badges
  - Mock courses: CSC 210, CSC 220, CSC 648, MATH 226, etc.
  - Used in Posting page for course selection
- **Usage**: `<CourseQuickPick selectedCourses={courses} onChange={setCourses} />`

### SFSU Email Hint Component
- **File**: `src/components/UI/SFSUEmailHint.jsx`
- **Features**:
  - Shows green success message when email ends with @sfsu.edu
  - Shows info hint for other emails
  - Used in Login and Register pages

## Mock Data

All mock data is centralized in `src/mocks/ui-demo.js`:
- `SFSU_COURSES` - List of SFSU courses
- `MOCK_UPCOMING_SESSIONS` - Student upcoming sessions
- `MOCK_SAVED_TUTORS` - Student saved tutors
- `MOCK_MESSAGES_PREVIEW` - Recent messages preview
- `MOCK_TUTOR_POSTINGS` - Tutor postings list
- `MOCK_REVIEWS_SUMMARY` - Reviews summary data
- `MOCK_INBOX_MESSAGES` - Inbox conversations
- `MOCK_CONVERSATION_THREAD` - Conversation messages
- `MOCK_SUBJECTS` - Available subjects
- `MOCK_AVAILABILITY` - Availability time slots

## Routes

All routes are configured in `src/App.jsx`:
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Unified dashboard (student/tutor tabs)
- `/post` - Create/Edit posting page
- `/messages` - Messages inbox/thread page

## How to Run

```bash
cd application/client
npm install  # if needed
npm run dev
```

Visit http://localhost:5173 and navigate to:
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Dashboard (switch between Student/Tutor tabs)
- `/post` - Create a new posting
- `/messages` - View messages inbox

## Demo Script (60-90 seconds)

1. **Login Page** (10s)
   - Navigate to `/login`
   - Show email field with @sfsu.edu hint
   - Enter email ending with @sfsu.edu → green checkmark appears
   - Show "Remember me" checkbox
   - Click "Sign In" → redirects to dashboard

2. **Registration Page** (15s)
   - Navigate to `/register`
   - Fill in form fields
   - Show SFSU email hint component
   - Select role (Student/Tutor)
   - Show terms checkbox
   - Click "Create Account" → redirects to dashboard

3. **Dashboard** (20s)
   - Show Student tab:
     - Upcoming Sessions widget
     - Saved Tutors widget
     - Recent Messages preview
   - Switch to Tutor tab:
     - Quick stats (views, messages, postings)
     - Reviews summary with star breakdown
     - My Postings list

4. **Posting Page** (20s)
   - Navigate to `/post`
   - Fill in title, select subjects
   - Show Course Quick-Pick component (SFSU feature)
   - Search for "CSC 648" → select it
   - Enter rate, bio
   - Show live preview updating on the right
   - Select availability chips

5. **Messages Page** (15s)
   - Navigate to `/messages`
   - Show two-pane layout
   - Left: Inbox with search, unread badges
   - Click a conversation → thread appears on right
   - Show message bubbles
   - Show composer (disabled with note)

## Acceptance Checklist

- ✅ Routes exist for `/login`, `/register`, `/dashboard`, `/post`, `/messages`
- ✅ Pages render with Bootstrap 5 framework + global styles
- ✅ No backend/API calls made (all mock data)
- ✅ Forms have labels, basic inline validation messages, keyboard-friendly
- ✅ Messages has inbox list + thread + composer (Send disabled)
- ✅ Posting has form + live preview
- ✅ Dashboard has student & tutor views with mock widgets
- ✅ SFSU feature implemented (Course Quick-Pick component)
- ✅ Responsive at 360/768/1280; no layout overflow
- ✅ `TODO: CONNECT_API_LATER` markers present
- ✅ App builds and runs: `npm run dev`

## Next Steps (API Integration)

When ready to connect to backend:

1. **Login**: Replace mock setTimeout with `loginUser()` API call
2. **Register**: Replace mock setTimeout with `registerUser()` API call
3. **Dashboard**: Replace mock data imports with API calls:
   - `getUpcomingSessions()`
   - `getSavedTutors()`
   - `getMessagesPreview()`
   - `getTutorPostings()`
   - `getReviewsSummary()`
4. **Posting**: Replace mock save with `createPosting()` or `updatePosting()` API calls
5. **Messages**: Replace mock data with:
   - `getInboxMessages(page, limit)`
   - `getConversationThread(conversationId)`
   - `sendMessage(messageData)`

All integration points are marked with `// TODO: CONNECT_API_LATER` comments.

