# Search the Professionals
Search the Professionals is a full-stack professional networking application built with modern web technologies. The platform enables users to create comprehensive professional profiles, connect with other professionals, and showcase their career journey.

## Technical Stack
### Frontend:
React 18 with TypeScript for type-safe component development.

React Router for client-side navigation and route management.

React Hook Form for efficient form handling and validation.

Axios for HTTP client with interceptors for authentication.

React Toastify for user notifications.

CSS3 with custom styling and responsive design.

### Backend:
Node.js with Express.js framework for RESTful API development.

MongoDB with Mongoose ODM for data persistence and schema modeling.

JWT (JSON Web Tokens) for secure authentication and authorization.

Multer for file upload handling with memory storage.

Cloudinary integration for cloud-based image storage and optimization.

bcrypt for password hashing and security.

## Key Features
User Authentication: Secure registration/login system with JWT-based session management.

Profile Management: Comprehensive user profiles with personal information, skills, and contact details.

Experience & Education Tracking: CRUD operations for professional experience, education history, and certifications.

Image Upload System: Profile picture management with Cloudinary integration supporting JPEG, PNG, and WebP formats.

User Search & Discovery: Search functionality to find and connect with other professionals.

Responsive Design: Mobile-first approach with adaptive layouts for all screen sizes.

## Architecture
The application follows a clean separation of concerns with a RESTful API backend serving a React SPA frontend. Authentication is handled via JWT tokens with protected routes, and file uploads are processed through Cloudinary for optimal performance and reliability.

# Setup Instructions
## Prerequisites
Node.js: Version 22.17.0

MongoDB: Running instance (local or cloud)

npm package manager

## Clone the Repository
git clone https://github.com/sabindevkota6/Search-the-Professionals.git

cd Search-the-Professionals

## Backend Setup
### Navigate to backend directory
cd backend

### Install dependencies
npm install

### Ensure the .env file is properly configured with the accurate details


## Start the backend server
cd backend

npm run dev

## Frontend Setup
### Navigate to frontend directory
cd frontend

### Install dependencies
npm install

### Start the development server
npm run dev

## Database Setup
Ensure MongoDB is running on your system.
