#!/bin/bash

# Rally-connect Docker Stop Script
# Use this to stop and clean up containers

docker-compose down

echo "✓ Stopped all containers"
echo ""
echo "To remove all data (volumes):"
echo "  docker-compose down -v"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
