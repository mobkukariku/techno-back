# Techno Backend

A comprehensive NestJS-based backend application for managing a technology organization's resources, including projects, departments, members, news, and client requests.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Database Structure](#database-structure)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Projects](#projects)
  - [Departments](#departments)
  - [News](#news)
  - [Member Profiles](#member-profiles)
  - [Requests](#requests)
- [Feature Details](#feature-details)
  - [Authentication and Authorization](#authentication-and-authorization)
  - [File Upload System](#file-upload-system)
  - [Role-based Access Control](#role-based-access-control)
  - [Filtering, Sorting and Pagination](#filtering-sorting-and-pagination)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

This application serves as the backend for a technology organization's management system. It provides robust APIs for handling various aspects of organizational management including:

- Project management with image galleries
- Department hierarchy management
- Team member profiles with skills and certificates
- News/articles publication with tagging
- Contact information management
- Work experience tracking
- External client/partner request handling

## System Architecture

The application is built with:
- **NestJS**: A progressive Node.js framework for building server-side applications
- **Prisma ORM**: Next-generation ORM for Node.js and TypeScript
- **PostgreSQL**: Open-source relational database
- **JWT**: JSON Web Tokens for secure authentication
- **Multer**: Middleware for handling file uploads

## Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn
- Git

## Installation

```bash
# Clone the repository
$ git clone <repository-url>
$ cd techno-back

# Install dependencies
$ npm install

# Setup environment
$ cp .env.example .env
# Edit .env file with your database credentials and other settings

# Generate Prisma client
$ npx prisma generate

# Run database migrations
$ npx prisma migrate dev
```

## Configuration

The application can be configured using environment variables in the `.env` file:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/techno_db?schema=public"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
HOST="localhost"

# File Storage
FILE_STORAGE_PATH="./uploads"
```

## Running the Application

```bash
# Development mode
$ npm run start

# Watch mode (auto-restart on file changes)
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Database Structure

The application uses PostgreSQL with Prisma ORM for database management. The main database models include:

### Users
- Core user accounts with authentication and role-based permissions
- Roles: member, manager, admin
- Linked to profiles, departments, and content

### Departments
- Organizational structure with hierarchy support
- Can have parent departments and sub-departments
- Each department can have a head and multiple members
- Linked to projects

### Projects
- Department initiatives with title, description, and image gallery
- Each project belongs to a specific department
- Supports multiple images per project

### MemberProfiles
- Extended user profiles with position, description
- Skills tracking through many-to-many relationship
- Certificate management with issue/expiration dates

### News
- Articles with title, content, image
- Tagged for categorization
- Linked to author (User)

### Requests
- External inquiries from clients/partners
- Categorized by direction
- Includes contact information and message content

## API Endpoints

### Authentication

#### Login
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticates a user and returns a JWT token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "member"
    }
  }
  ```

### Projects

#### Get All Projects
- **Endpoint**: `GET /projects`
- **Description**: Retrieves a paginated list of projects with optional filtering and sorting
- **Query Parameters**:
  - `search`: Search term to filter by title or description
  - `departmentId`: Filter by specific department
  - `sort`: Sort order (e.g., "newest" for descending by creation date)
  - `limit`: Number of items per page (default: 3)
  - `page`: Page number (default: 1)
- **Response**:
  ```json
  [
    {
      "id": "uuid",
      "title": "Project Title",
      "description": "Project description...",
      "departmentId": "department-uuid",
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z",
      "images": [
        {
          "id": "image-uuid",
          "imageUrl": "http://localhost:5000/images/projects/image.jpg"
        }
      ]
    }
  ]
  ```

#### Get Project by ID
- **Endpoint**: `GET /projects/:id`
- **Description**: Retrieves a specific project by its ID
- **Parameters**:
  - `id`: Project UUID
- **Response**: Same format as single project in the list response

#### Create Project
- **Endpoint**: `POST /projects`
- **Description**: Creates a new project with optional images
- **Authentication**: Required (manager role)
- **Request**: Multipart form data
  - `title`: Project title
  - `description`: Project description
  - `departmentId`: UUID of the department
  - `images`: Multiple image files (optional)
- **Response**:
  ```json
  {
    "id": "uuid",
    "title": "New Project",
    "description": "Project description",
    "departmentId": "department-uuid",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z",
    "images": [
      {
        "id": "image-uuid",
        "imageUrl": "http://localhost:5000/images/projects/image.jpg"
      }
    ]
  }
  ```

#### Update Project
- **Endpoint**: `PATCH /projects/:id`
- **Description**: Updates an existing project
- **Authentication**: Required (manager role)
- **Parameters**:
  - `id`: Project UUID
- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "description": "Updated description",
    "departmentId": "department-uuid"
  }
  ```
- **Response**: Updated project object

### Departments

#### Get All Departments
- **Endpoint**: `GET /departments`
- **Description**: Retrieves a list of all departments, optionally with hierarchy
- **Query Parameters**:
  - `includeSubDepartments`: Boolean to include nested departments
- **Response**: List of department objects with optional nested structure

#### Get Department by ID
- **Endpoint**: `GET /departments/:id`
- **Description**: Retrieves a specific department by its ID
- **Parameters**:
  - `id`: Department UUID
- **Response**: Department object with members and head information

#### Create Department
- **Endpoint**: `POST /departments`
- **Description**: Creates a new department
- **Authentication**: Required (manager or admin role)
- **Request Body**:
  ```json
  {
    "name": "Department Name",
    "headId": "user-uuid", // Optional
    "parentDepartmentId": "parent-department-uuid" // Optional
  }
  ```
- **Response**: Created department object

### Member Profiles

#### Get Member Profile
- **Endpoint**: `GET /members/:id/profile`
- **Description**: Retrieves a member's profile with skills and certificates
- **Parameters**:
  - `id`: User UUID
- **Response**: Member profile object with related data

#### Update Member Profile
- **Endpoint**: `PATCH /members/:id/profile`
- **Description**: Updates a member's profile
- **Authentication**: Required (own profile or admin role)
- **Request**: Multipart form data with profile information and optional image

### News

#### Get All News
- **Endpoint**: `GET /news`
- **Description**: Retrieves a paginated list of news articles
- **Query Parameters**: Pagination and filtering options
- **Response**: List of news articles with author and tags

## Feature Details

### Authentication and Authorization

The application uses JWT (JSON Web Tokens) for authentication:

1. Users authenticate via the login endpoint
2. A JWT token is returned and should be included in the Authorization header
3. The `AuthGuard` validates the token for protected routes
4. The `RolesGuard` checks if the authenticated user has the required role for specific endpoints

Example of a protected endpoint:
```typescript
@Post()
@Roles('manager')
@UseGuards(AuthGuard, RolesGuard)
async createProject() {
  // Only accessible to users with manager role
}
```

### File Upload System

The application uses Multer for handling file uploads:

1. Project images are uploaded via multipart/form-data
2. Files are processed by the appropriate interceptor
3. Files are stored in the filesystem and URLs are saved in the database

Example configuration for project image uploads:
```typescript
@UseInterceptors(
  FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], multerConfig)
)
```

### Role-based Access Control

The system implements three main roles:

1. **Member**: Regular user with access to basic information
   - Can view their own profile
   - Can view projects and departments
   - Cannot create or modify projects
   
2. **Manager**: Department or project manager
   - All member permissions
   - Can create and update projects
   - Can manage their department
   
3. **Admin**: System administrator
   - All manager permissions
   - Can manage users and roles
   - Can create and manage departments
   - Full system access

### Filtering, Sorting and Pagination

The API supports comprehensive data querying capabilities:

- **Filtering**: Filter data by specific fields (e.g., departmentId, search term)
- **Sorting**: Sort data by creation date or other fields
- **Pagination**: Limit results with page and limit parameters

Example for projects API:
```
GET /projects?search=technology&departmentId=123&sort=newest&page=2&limit=10
```

## Error Handling

The application uses NestJS's built-in exception filters to handle errors consistently. API responses include appropriate HTTP status codes and error messages.

## Testing

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Deployment

For production deployment:

1. Set the appropriate environment variables
2. Build the application: `npm run build`
3. Start the production server: `npm run start:prod`

For container deployment, a Dockerfile is provided.

## Contributing

1. Create a feature branch from the development branch
2. Implement your changes following the code style guidelines
3. Add appropriate tests for your changes
4. Submit a pull request with a clear description of the changes

## License

This project is proprietary and confidential. Unauthorized distribution or use is prohibited.
