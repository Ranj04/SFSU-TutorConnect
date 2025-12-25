# ============================================================================
# TutorConnect M3 - API Test Script
# ============================================================================
# Run these commands to verify the implementation
# NOTE: Backend must be running at http://localhost:8000
# ============================================================================

# Test 1: Health Check
Write-Host "
=== Test 1: Health Check ===" -ForegroundColor Cyan
curl http://localhost:8000/health

# Test 2: Get Categories (Dynamic from DB)
Write-Host "

=== Test 2: Get Categories (Dynamic) ===" -ForegroundColor Cyan
curl http://localhost:8000/api/categories

# Test 3: Search with Pagination (Page 1, Limit 2)
Write-Host "

=== Test 3: Paginated Search (Page 1, Limit 2) ===" -ForegroundColor Cyan
curl "http://localhost:8000/api/search?page=1&limit=2"

# Test 4: Search with Pagination (Page 2)
Write-Host "

=== Test 4: Paginated Search (Page 2) ===" -ForegroundColor Cyan
curl "http://localhost:8000/api/search?page=2&limit=2"

# Test 5: Search by Category
Write-Host "

=== Test 5: Search by Category (Computer Science) ===" -ForegroundColor Cyan
curl "http://localhost:8000/api/search?category=computer-science&page=1&limit=10"

# Test 6: Search with Text Query
Write-Host "

=== Test 6: Search with Text Query (TA) ===" -ForegroundColor Cyan
curl "http://localhost:8000/api/search?q=TA&page=1&limit=10"

# Test 7: Validation - Invalid Category (Should return 400)
Write-Host "

=== Test 7: Invalid Category Validation ===" -ForegroundColor Cyan
curl "http://localhost:8000/api/search?category=invalid-category"

# Test 8: Validation - Query Too Long (Should return 400)
Write-Host "

=== Test 8: Query Length Validation ===" -ForegroundColor Cyan
curl "http://localhost:8000/api/search?q=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

# Test 9: Validation - Invalid Page Number (Should return 422)
Write-Host "

=== Test 9: Page Number Validation ===" -ForegroundColor Cyan
curl "http://localhost:8000/api/search?page=0"

Write-Host "

=== All Tests Complete ===" -ForegroundColor Green
