# Project README

## Project Overview

This project is a web application that includes user authentication, item management, bidding functionality, and notifications. The application uses JWT for secure authentication and implements rate limiting to prevent abuse. Below is a detailed description of the project structure and setup.

## Project Structure

### Models
- **User.js**: Defines the User schema and handles user-related data.
- **Item.js**: Defines the Item schema and handles item-related data.
- **Notification.js**: Defines the Notification schema and manages notifications for users.
- **Bid.js**: Defines the Bid schema and manages bids on items.

### Routes
- **userroutes.js**: Manages user registration and login. On successful login, a JWT token is issued.
- **itemroutes.js**: Handles CRUD operations on items. Requires a valid JWT token passed in the header.
- **bidroutes.js**: Manages placing bids and retrieving bid information.
- **notificationroutes.js**: Handles creating and retrieving notifications.

### Middleware
- **auth.js**: Middleware to authenticate JWT tokens.
- **rateLimiter.js**: Middleware to protect too much api hit.
### Configuration
- **.env**: Contains database configuration details and mailing settings for password reset functionality.

### Rate Limiting
- Implemented a rate limiter to restrict users to 20 requests. After exceeding the limit, users receive a message to wait for 15 minutes before trying again.
### File Uploads
- **multer**: Used for handling file uploads. Files are stored locally.

### Testing
- **_test_**: Contains tests for User and Item routes to ensure they function correctly.

### Scripts
- `npm run dev`: Runs the application in development mode.
- `node server.js`: Starts the application server.

