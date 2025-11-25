#!/bin/bash

# Rally-connect Docker Quick Start Script
# Run this to start the entire application

set -e

echo "🚀 Rally-connect Docker Quick Start"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Docker
echo -e "${BLUE}Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found. Please install Docker first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker found${NC}"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose not found. Please install Docker Compose first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose found${NC}"
echo ""

# Stop existing containers
echo -e "${BLUE}Checking for existing containers...${NC}"
if docker-compose ps 2>/dev/null | grep -q "rally-"; then
    echo -e "${YELLOW}⚠ Stopping existing Rally-connect containers...${NC}"
    docker-compose down
fi
echo ""

# Build and start
echo -e "${BLUE}Building and starting services...${NC}"
echo "This may take 2-3 minutes on first run..."
echo ""

docker-compose up --build

echo ""
echo -e "${GREEN}✅ All services started!${NC}"
echo ""
echo "Access the application at:"
echo -e "  Frontend:  ${BLUE}http://localhost:4300${NC}"
echo -e "  Backend:   ${BLUE}http://localhost:4800${NC}"
echo -e "  Health:    ${BLUE}http://localhost:4800/health${NC}"
echo ""
echo "Useful commands:"
echo "  docker-compose logs -f             View all logs"
echo "  docker-compose logs -f rally-backend  View backend logs"
echo "  docker-compose exec rally-backend npm run prisma:studio  Open database GUI"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop services${NC}"
