// Exercise 3: HTTP Methods - CRUD Operations
//
// TASK: Create a complete CRUD API for managing users with the following requirements:
//
// 1. Set up Express with JSON parsing middleware
// 
// 2. Create an in-memory users array with initial data:
//    - User 1: { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 }
//    - User 2: { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 }
//    - Keep track of nextId for new users
//
// 3. Implement these HTTP methods:
//    - GET /users - return all users (with optional filtering by name, minAge)
//    - GET /users/:id - return specific user by ID, 404 if not found
//    - POST /users - create new user (validate name and email required)
//    - PUT /users/:id - update entire user (replace all fields)
//    - PATCH /users/:id - partial update (update only provided fields)
//    - DELETE /users/:id - delete user, return deleted user info
//    - HEAD /users/:id - check if user exists (return headers only)
//    - OPTIONS /users - return allowed methods
//
// 4. Add validation:
//    - Name and email are required for POST/PUT
//    - Email must be unique across all users
//    - Return appropriate error codes (400, 404, 409)
//
// 5. Add timestamps:
//    - createdAt when user is created
//    - updatedAt when user is modified
//
// HINTS:
// - Use express.json() middleware for parsing JSON bodies
// - Use array methods: find(), findIndex(), splice(), push()
// - Use parseInt(req.params.id) to convert string ID to number
// - Return 201 status for successful creation
// - Return 409 for conflicts (duplicate email)

import express from 'express';

const app = express();
const PORT = 3002;

// TODO: Add JSON parsing middleware

// TODO: Create in-memory users array with initial data

// TODO: Implement all HTTP methods for CRUD operations

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Test these endpoints:');
    console.log('- GET    /users');
    console.log('- GET    /users/:id');
    console.log('- POST   /users');
    console.log('- PUT    /users/:id');
    console.log('- PATCH  /users/:id');
    console.log('- DELETE /users/:id');
    console.log('- HEAD   /users/:id');
    console.log('- OPTIONS /users');
});