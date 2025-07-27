# Fursa Frontend - Docker Deployment Guide

This guide covers how to deploy the Fursa frontend application using Docker in both development and production environments.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)
- At least 4GB of available RAM for builds

## Project Structure

```
frontend/
├── Dockerfile              # Production build
├── Dockerfile.dev          # Development build  
├── docker-compose.yml      # Development environment
├── docker-compose.prod.yml # Production environment
├── nginx.conf              # Nginx configuration for production
├── .dockerignore           # Files to exclude from Docker context
└── package.json            # Node.js dependencies
```

## Development Environment

### Quick Start

```bash
# Start development environment
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Development Features

- **Hot Reload**: Code changes are automatically reflected
- **Volume Mounting**: Source code is mounted for live editing
- **Port 3000**: Application accessible at http://localhost:3000
- **Development Dependencies**: Includes all dev tools and debugging

### Development Configuration

The development setup uses:
- `Dockerfile.dev` for the container build
- Volume mounting for live code updates
- Node.js development server with hot reload
- All development dependencies installed

## Production Environment

### Build and Deploy

```bash
# Build and start production environment
docker-compose -f docker-compose.prod.yml up --build

# Run in background
docker-compose -f docker-compose.prod.yml up -d --build

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

### Production Features

- **Optimized Build**: Multi-stage build with production optimizations
- **Nginx Server**: Static files served by Nginx
- **Port 80**: Application accessible at http://localhost
- **Minimal Size**: Only production files included
- **Security**: Non-root user execution

### Production Configuration

The production setup uses:
- Multi-stage Docker build
- Node.js for building the React application
- Nginx Alpine for serving static files
- Optimized for performance and security

## Docker Commands Reference

### Development Commands

```bash
# Build development image
docker-compose build

# Run with specific service
docker-compose up frontend

# Execute commands in running container
docker-compose exec frontend npm install
docker-compose exec frontend npm test

# View container logs
docker-compose logs frontend

# Restart services
docker-compose restart
```

### Production Commands

```bash
# Build production image manually
docker build -f Dockerfile -t fursa-frontend-prod .

# Run production container
docker run -p 80:80 fursa-frontend-prod

# Build with specific name
docker build -f Dockerfile -t fursa-frontend:latest .

# Run production with docker-compose
docker-compose -f docker-compose.prod.yml up --build
```

## Environment Configuration

### Development Environment Variables

```env
NODE_ENV=development
REACT_APP_API_URL=http://localhost:8000
REACT_APP_DEBUG=true
```

### Production Environment Variables

```env
NODE_ENV=production
REACT_APP_API_URL=https://api.fursa.com
REACT_APP_DEBUG=false
```

Create `.env.development` and `.env.production` files as needed.

## Nginx Configuration

The production build uses a custom Nginx configuration:

- **Gzip Compression**: Enabled for better performance
- **Cache Headers**: Optimized for static assets
- **SPA Support**: Handles React Router client-side routing
- **Security Headers**: Basic security configurations

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :3000
   
   # Change port in docker-compose.yml
   ports:
     - "3001:3000"
   ```

2. **Out of Memory During Build**
   ```bash
   # Increase Docker memory limit
   # Docker Desktop > Settings > Resources > Memory
   ```

3. **Dependencies Not Installing**
   ```bash
   # Clear Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Volume Mount Issues**
   ```bash
   # Check Docker file sharing settings
   # Docker Desktop > Settings > Resources > File Sharing
   ```

### Build Optimization

For faster builds:
- Use `.dockerignore` to exclude unnecessary files
- Multi-stage builds are already implemented
- Dependencies are cached in layers

### Performance Monitoring

```bash
# Check container resource usage
docker stats

# View container processes
docker-compose top

# Check image sizes
docker images | grep fursa
```

## Security Considerations

1. **Non-root User**: Production container runs as non-root
2. **Minimal Base Images**: Using Alpine Linux for smaller attack surface
3. **No Development Dependencies**: Production builds exclude dev dependencies
4. **Environment Variables**: Sensitive data should use Docker secrets

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Production Image
        run: |
          cd frontend
          docker build -f Dockerfile -t fursa-frontend:${{ github.sha }} .
          
      - name: Deploy to Production
        run: |
          # Add your deployment commands here
```

## Monitoring and Logs

### Log Management

```bash
# View real-time logs
docker-compose logs -f frontend

# View last 100 lines
docker-compose logs --tail=100 frontend

# Save logs to file
docker-compose logs frontend > frontend.log
```

### Health Checks

Both development and production containers include basic health checks to ensure the application is running properly.

## Scaling

For production scaling:

```bash
# Scale to multiple instances
docker-compose -f docker-compose.prod.yml up --scale frontend=3

# With load balancer
# Add nginx load balancer or use Docker Swarm/Kubernetes
```

## Backup and Recovery

### Database Backups
If using a database, ensure regular backups:

```bash
# Example for PostgreSQL
docker-compose exec db pg_dump -U user database > backup.sql
```

### Volume Backups
```bash
# Backup Docker volumes
docker run --rm -v fursa_node_modules:/data -v $(pwd):/backup alpine tar czf /backup/node_modules.tar.gz -C /data .
```

## Support

For issues with this deployment:
1. Check the logs first: `docker-compose logs`
2. Verify your Docker installation
3. Ensure sufficient system resources
4. Check firewall and port availability

---

*Last updated: June 2025*
