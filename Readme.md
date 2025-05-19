# Book Review API

A RESTful API for managing books and reviews, built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT)
- Book management (CRUD operations)
- Review system (ratings and comments)
- Search functionality
- Pagination

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/book-review-api.git
   cd book-review-api

2. Install Dependencies:
   ```bash
   npm install

3. Set up environment variables:

  Create a .env file in the root directory
 
  Add the following variables:
  ```bash
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000

4. Start the server:
   ```bash
   npm run server
