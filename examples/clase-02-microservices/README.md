# Enrollment Platform - Microservices Architecture

A microservices-based enrollment platform with API Gateway and three independent services built with Next.js and Docker.

## Architecture

- **API Gateway (nginx)**: Routes requests to appropriate microservices
- **Enrollment Service**: Handles enrollment operations
- **Student Data Service**: Manages student information
- **Subjects Service**: Manages subject offerings

## Project Structure

```
enrollment-platform-project/
├── docker-compose.yml
├── gateway/
│   └── nginx.conf
└── services/
    ├── enrollment-service/
    │   ├── Dockerfile
    │   ├── package.json
    │   ├── next.config.js
    │   └── pages/
    │       └── api/
    │           └── index.js
    ├── student-data-service/
    │   ├── Dockerfile
    │   ├── package.json
    │   ├── next.config.js
    │   └── pages/
    │       └── api/
    │           └── index.js
    └── subjects-service/
        ├── Dockerfile
        ├── package.json
        ├── next.config.js
        └── pages/
            └── api/
                └── index.js
```

## API Endpoints

All requests go through the API Gateway at `http://localhost:3000`:

### Main Endpoints
- **GET /enrollment/api** → "You are in the enrollment service"
- **GET /student-data/api** → "You are in the student data service"
- **GET /subjects/api** → "You are in the offer of subjects service"

### Health Check Endpoints
- **GET /enrollment/health** → Enrollment service health status
- **GET /student-data/health** → Student data service health status
- **GET /subjects/health** → Subjects service health status
- **GET /health** → Gateway health check

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Run the Application

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Test the endpoints:**
   ```bash
   # Main Endpoints
   curl http://localhost:3000/enrollment/api
   curl http://localhost:3000/student-data/api
   curl http://localhost:3000/subjects/api

   # Health Checks
   curl http://localhost:3000/enrollment/health
   curl http://localhost:3000/student-data/health
   curl http://localhost:3000/subjects/health
   curl http://localhost:3000/health
   ```

3. **Stop the services:**
   ```bash
   docker-compose down
   ```

### Development Mode

To run a single service in development mode:

```bash
cd services/enrollment-service
npm install
npm run dev
```

**Important:** When running in dev mode, access the API at:
- `http://localhost:3000/api` (NOT just `http://localhost:3000/`)

You'll get a 404 on the root URL because these are API-only services without a home page.

## Services Details

### Enrollment Service
- **Container**: `enrollment-service`
- **Internal Port**: 3000
- **Route**: `/enrollment/*`

### Student Data Service
- **Container**: `student-data-service`
- **Internal Port**: 3000
- **Route**: `/student-data/*`

### Subjects Service
- **Container**: `subjects-service`
- **Internal Port**: 3000
- **Route**: `/subjects/*`

### API Gateway
- **Container**: `api-gateway`
- **External Port**: 3000 (exposed to host)
- **Technology**: nginx (Alpine Linux)

## Docker Network

All services communicate through a bridge network called `microservices-network`.

## Adding New Endpoints

To add new endpoints to any service, create new API route files in the respective service's `pages/api/` directory:

```javascript
// services/enrollment-service/pages/api/new-endpoint.js
export default function handler(req, res) {
  res.status(200).json({ message: 'New endpoint response' });
}
```

Access at: `http://localhost:3000/enrollment/api/new-endpoint`
