# Quick Setup Guide - Frontend & Backend Connection

## Prerequisites
- Node.js and npm installed
- Python 3.11+ installed
- MySQL database running

## Step 1: Start the Backend

```bash
# Navigate to backend directory
cd application/backend

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies (if not done)
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend should be running at: **http://localhost:8000**
📚 API Documentation: **http://localhost:8000/docs**

## Step 2: Start the Frontend

Open a new terminal:

```bash
# Navigate to frontend directory
cd application/client

# Install dependencies (if not done)
npm install

# Start the development server
npm run dev
```

✅ Frontend should be running at: **http://localhost:5173**

## Step 3: Test the Integration

1. Open your browser to **http://localhost:5173**
2. You should see the home page with a search form
3. Enter a search term (e.g., "computer science" or "python")
4. Click "Search" button
5. You'll be redirected to `/search` with results from the backend

### Quick Test Commands

Test backend directly:
```bash
# Health check
curl http://localhost:8000/health

# Get all tutors
curl http://localhost:8000/api/search

# Search for specific subject
curl "http://localhost:8000/api/search?category=computer-science"

# Search with query
curl "http://localhost:8000/api/search?q=python"

# Get all subjects
curl http://localhost:8000/api/subjects
```

## Troubleshooting

### Backend won't start
- Make sure MySQL is running
- Check database credentials in backend config
- Ensure all migrations are applied

### Frontend can't connect to backend
- Verify backend is running on port 8000
- Check browser console for errors
- Clear browser cache and restart dev server

### No tutors showing up
- Make sure database is seeded with data
- Check backend logs for database errors
- Verify tutors have `approval_status = 'approved'`

## Project Structure

```
application/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── config.py            # Configuration & CORS settings
│   │   ├── routes/
│   │   │   └── search.py        # Search API endpoints
│   │   └── services/
│   │       └── search.py        # Search business logic
│   └── requirements.txt
│
└── client/
    ├── src/
    │   ├── services/
    │   │   └── api.js           # ✨ NEW: API service layer
    │   ├── pages/
    │   │   ├── Home.jsx         # Home page with search
    │   │   └── SearchResults.jsx # ✨ NEW: Results page
    │   └── App.jsx              # ✨ UPDATED: Added /search route
    ├── vite.config.js           # ✨ UPDATED: Added proxy config
    └── package.json
```

## What Was Added

### New Files:
1. **`src/services/api.js`** - Centralized API communication
2. **`src/pages/SearchResults.jsx`** - Search results display
3. **`README_BACKEND_INTEGRATION.md`** - Detailed integration docs

### Modified Files:
1. **`vite.config.js`** - Added proxy for `/api` and `/health`
2. **`src/App.jsx`** - Added `/search` route

## Features Implemented

✅ Real-time tutor search
✅ Subject filtering
✅ Keyword search in bios, courses, descriptions
✅ Loading states
✅ Error handling
✅ Responsive design
✅ CORS configuration
✅ API proxy (no CORS issues in dev)

## Next Steps

- [ ] Add tutor profile detail pages
- [ ] Implement user authentication
- [ ] Add messaging between students and tutors
- [ ] Implement booking/scheduling system
- [ ] Add user dashboard
- [ ] Implement reviews and ratings

---

For more detailed information, see `README_BACKEND_INTEGRATION.md`

