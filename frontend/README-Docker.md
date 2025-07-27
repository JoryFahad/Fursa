# Fursa Frontend Docker Setup

This directory contains the Docker configuration for the Fursa React frontend application.

## Prerequisites

- Docker Desktop installed and running
- Node.js 18+ (for local development)

## Docker Files

- `Dockerfile` - Production build configuration
- `Dockerfile.dev` - Development configuration with hot reload
- `docker-compose.yml` - Frontend-only development setup
- `.dockerignore` - Files to exclude from Docker build context

## Quick Start

### Option 1: Frontend Only (Development)

```bash
# Navigate to the frontend directory
cd frontend

# Build and run the frontend container
docker-compose up --build

# Access the application at http://localhost:3001
```

### Option 2: Full Stack (All Services)

```bash
# Navigate to the web directory (parent of frontend)
cd ..

# Run all services (database, backend, frontend)
docker-compose up --build

# Access the application at http://localhost:3001
# Backend API at http://localhost:5000
# Database at localhost:5432
```

## Available Commands

### Development

```bash
# Start development environment
docker-compose up

# Start with rebuild
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs frontend

# Shell into frontend container
docker-compose exec frontend sh
```

### Production Build

```bash
# Build production image
docker build -t fursa-frontend:latest .

# Run production container
docker run -p 3001:3000 fursa-frontend:latest
```

## Environment Variables

The following environment variables can be configured:

- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000)
- `WATCHPACK_POLLING` - Enable file watching polling for Windows (default: true)
- `FAST_REFRESH` - Enable React Fast Refresh (default: true)

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port mapping in docker-compose.yml
2. **File changes not detected**: Ensure WATCHPACK_POLLING is set to true
3. **Module not found**: Delete node_modules and rebuild the container

### Windows-Specific

- File watching requires polling mode for proper hot reload
- Ensure Docker Desktop is configured to use WSL 2 backend

### Cleaning Up

```bash
# Remove containers and networks
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a
```

## Integration with Backend

The frontend is configured to connect to the backend at `http://localhost:5000`. Make sure your backend is running either:

1. Locally on port 5000
2. In a Docker container exposed on port 5000
3. Update the `REACT_APP_API_URL` environment variable

## Development Workflow

1. Make changes to your React code
2. Changes will be automatically reflected in the browser
3. Hot reload is enabled for faster development
4. TypeScript compilation errors will appear in the container logs
