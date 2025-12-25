# Backend Integration Guide

This document explains how the frontend connects to the FastAPI backend.

## Overview

The frontend is now integrated with the FastAPI backend running on `http://localhost:8000`. This enables real-time tutor search functionality.

## Files Created/Modified

### New Files

1. **`src/services/api.js`** - API service layer
   - Handles all backend communication
   - Provides functions: `searchTutors()`, `getSubjects()`, `healthCheck()`
   - Includes error handling and response parsing

2. **`src/pages/SearchResults.jsx`** - Search results page
   - Fetches and displays tutors from the backend
   - Supports real-time search and filtering
   - Shows loading states and error handling

3. **`.env.example`** - Environment variable template
   - Contains `VITE_API_BASE_URL` configuration

### Modified Files

1. **`vite.config.js`** - Added proxy configuration
   - Proxies `/api/*` and `/health` requests to backend
   - Prevents CORS issues during development

2. **`src/App.jsx`** - Added search route
   - New route: `/search` → `<SearchResults />`

## Setup Instructions

### 1. Start the Backend

```bash
cd application/backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend should be running at `http://localhost:8000`

### 2. Start the Frontend

```bash
cd application/client
npm install  # If not already done
npm run dev
```

The frontend will start at `http://localhost:5173`

### 3. Test the Integration

1. Open `http://localhost:5173` in your browser
2. Use the search form on the home page
3. You'll be redirected to `/search` with your query
4. The page will fetch and display real tutors from the database

## API Endpoints Used

### Search Tutors
```
GET /api/search?category={subject-slug}&q={search-term}
```

**Example:**
```
GET /api/search?category=computer-science&q=python
```

**Response:**
```json
{
  "count": 2,
  "results": [
    {
      "user_id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "bio": "Experienced CS tutor...",
      "major": "Computer Science",
      "courses": [
        {"code": "CSC 648", "title": "Software Engineering"}
      ],
      "subjects": ["Computer Science"]
    }
  ]
}
```

### Get Subjects
```
GET /api/subjects
```

**Response:**
```json
{
  "count": 5,
  "subjects": [
    {"name": "Computer Science", "slug": "computer-science"},
    {"name": "Mathematics", "slug": "mathematics"}
  ]
}
```

### Health Check
```
GET /health
GET /api/v1/health
```

## Using the API Service

### In a React Component

```jsx
import { searchTutors, getSubjects } from '../services/api';

function MyComponent() {
  const [tutors, setTutors] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Search for tutors
        const data = await searchTutors({
          category: 'computer-science',
          q: 'python'
        });
        setTutors(data.results);
        
        // Get all subjects
        const subjects = await getSubjects();
        console.log(subjects);
      } catch (error) {
        console.error('API error:', error);
      }
    }
    
    fetchData();
  }, []);
  
  return (
    <div>
      {tutors.map(tutor => (
        <div key={tutor.user_id}>{tutor.first_name}</div>
      ))}
    </div>
  );
}
```

## Environment Variables

The frontend uses Vite's environment variable system:

- **`VITE_API_BASE_URL`** - Backend API base URL (default: `http://localhost:8000`)

To change the backend URL, create a `.env` file:

```env
VITE_API_BASE_URL=http://your-backend-url:8000
```

⚠️ **Note:** The `.env` file is gitignored to prevent committing sensitive data.

## Development Proxy

The Vite dev server proxies API requests to avoid CORS issues:

```js
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
    '/health': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    }
  }
}
```

This means when the frontend makes a request to `/api/search`, Vite automatically forwards it to `http://localhost:8000/api/search`.

## Troubleshooting

### Backend Connection Failed

**Error:** "Failed to fetch tutors. Please try again."

**Solutions:**
1. Make sure the backend is running: `http://localhost:8000`
2. Check backend logs for errors
3. Verify database is running and seeded with data
4. Test the API directly: `curl http://localhost:8000/health`

### CORS Issues

If you see CORS errors in the browser console:

1. Check backend `config.py` - should include:
   ```python
   CORS_ORIGINS: list = [
       "http://localhost:5173",
       "http://127.0.0.1:5173",
   ]
   ```

2. Make sure the Vite proxy is configured (it should be)

### No Tutors Found

If the search returns no results:

1. Check if the database is seeded with tutor data
2. Run seed scripts: `mysql -u root -p tutorconnect_dev < db/seed/seed_demo.sql`
3. Verify tutors are approved in the database

## Testing Backend Connection

### Quick Test Script

Add this to your browser console on `http://localhost:5173`:

```javascript
// Test health check
fetch('/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test search
fetch('/api/search')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test subjects
fetch('/api/subjects')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

## Next Steps

1. **Add more API endpoints** as the backend grows
2. **Implement authentication** with JWT tokens
3. **Add tutor profile detail pages** with individual tutor data
4. **Implement messaging** between students and tutors
5. **Add booking/scheduling** functionality

## Contributing

When adding new API integrations:

1. Add the API function to `src/services/api.js`
2. Use the function in your components
3. Handle loading and error states
4. Update this README with new endpoints

## Architecture

```
Frontend (React)
    ↓
API Service Layer (src/services/api.js)
    ↓
Vite Proxy (:5173 → :8000)
    ↓
FastAPI Backend (:8000)
    ↓
MySQL Database
```

---

**Last Updated:** November 2024
**Backend Version:** 0.1.0
**API Documentation:** http://localhost:8000/docs

