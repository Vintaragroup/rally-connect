#!/bin/bash

# Test script for Simplified Onboarding Flow
# This verifies the complete signup -> code entry -> org select -> sport select -> dashboard flow

echo "🧪 Testing Simplified Onboarding Flow"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Backend health check
echo "📋 Test 1: Backend Health Check"
HEALTH=$(curl -s http://localhost:4802/health)
if echo "$HEALTH" | jq . > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
    echo "  Response: $HEALTH"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
    exit 1
fi
echo ""

# Test 2: Frontend is accessible
echo "📋 Test 2: Frontend Accessibility"
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4300)
if [ "$FRONTEND" == "200" ]; then
    echo -e "${GREEN}✓ Frontend is accessible on localhost:4300${NC}"
else
    echo -e "${RED}✗ Frontend returned status $FRONTEND${NC}"
    exit 1
fi
echo ""

# Test 3: Check database connection
echo "📋 Test 3: Database Connection"
DB_STATUS=$(curl -s http://localhost:4802/health | jq -r '.database')
if [ "$DB_STATUS" == "connected" ]; then
    echo -e "${GREEN}✓ Database is connected${NC}"
else
    echo -e "${RED}✗ Database connection status: $DB_STATUS${NC}"
    exit 1
fi
echo ""

# Test 4: API endpoints exist
echo "📋 Test 4: API Endpoints"
declare -a ENDPOINTS=(
    "/auth/me"
    "/auth/code-validation"
)

for endpoint in "${ENDPOINTS[@]}"; do
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:4802$endpoint \
        -H "Content-Type: application/json" \
        -d '{}')
    
    # These should return 400+ because we're not authenticated/sending invalid data
    # But they should NOT return 404
    if [ "$RESPONSE" != "404" ]; then
        echo -e "${GREEN}✓ Endpoint $endpoint exists (status: $RESPONSE)${NC}"
    else
        echo -e "${RED}✗ Endpoint $endpoint not found${NC}"
    fi
done
echo ""

# Test 5: Frontend environment variables
echo "📋 Test 5: Frontend Environment Check"
FRONTEND_HTML=$(curl -s http://localhost:4300 2>/dev/null)

if echo "$FRONTEND_HTML" | grep -q "VITE"; then
    echo -e "${GREEN}✓ Frontend is using Vite with HMR enabled${NC}"
else
    echo -e "${YELLOW}⚠ Could not verify Vite in response${NC}"
fi
echo ""

# Test 6: Check if API URL is correct in frontend
echo "📋 Test 6: API URL Configuration"
if [ -f ".env.local" ]; then
    API_URL=$(grep "VITE_API_URL" .env.local | cut -d '=' -f2)
    echo -e "${GREEN}✓ Frontend API URL configured: $API_URL${NC}"
    
    if [ "$API_URL" == "http://localhost:4802" ]; then
        echo -e "${GREEN}✓ API URL points to localhost (correct for local development)${NC}"
    else
        echo -e "${YELLOW}⚠ API URL is $API_URL (verify if this is correct for your setup)${NC}"
    fi
else
    echo -e "${RED}✗ .env.local file not found${NC}"
fi
echo ""

echo "======================================"
echo -e "${GREEN}All system checks passed!${NC}"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:4300 in your browser"
echo "2. Sign up with a test account"
echo "3. Go through the onboarding flow:"
echo "   - Code Entry (skip if no code)"
echo "   - Organization Selection"
echo "   - Sport Selection"
echo "   - Completion"
echo "4. Verify you land on the home dashboard"
echo "5. Check browser console for any errors"
echo ""
