// Exercise 6: Request Body Parsing - JSON, Form Data, Raw Text
//
// TASK: Handle different types of request bodies with proper parsing and validation:
//
// 1. Setup middleware for body parsing:
//    - express.json() for JSON data
//    - express.urlencoded() for form data
//    - express.text() for raw text
//    - Set size limits and proper error handling
//
// 2. Create POST /api/users endpoint:
//    - Accept JSON user data: name, email, age, address
//    - Validate required fields (name, email)
//    - Validate email format and age range (18-120)
//    - Return created user with generated ID
//    - Handle validation errors with appropriate status codes
//
// 3. Create POST /api/contact endpoint:
//    - Accept form-urlencoded data: name, email, subject, message
//    - Validate all fields are required
//    - Save to contact submissions array
//    - Return success message with submission ID
//
// 4. Create POST /api/webhook endpoint:
//    - Accept raw text data (simulate webhook payload)
//    - Log the raw payload
//    - Parse if it's JSON, handle if it's plain text
//    - Return confirmation with payload info
//
// 5. Create PUT /api/users/:id endpoint:
//    - Update existing user (partial updates allowed)
//    - Validate only provided fields
//    - Return updated user or 404 if not found
//
// 6. Error handling:
//    - Handle JSON parsing errors
//    - Handle missing required fields
//    - Handle invalid data types
//    - Return proper HTTP status codes
//
// HINTS:
// - Use req.body to access parsed body data
// - Check req.is('json') or req.is('application/x-www-form-urlencoded')
// - Use typeof to validate data types
// - Regular expressions for email validation
// - Array.find() to locate existing users
// - Object.assign() for partial updates

import express from 'express';

const app = express();
const PORT = 3005;

// TODO: Setup body parsing middleware with size limits

// TODO: Create in-memory storage arrays
let users = [];
let contactSubmissions = [];
let webhookLogs = [];
let nextUserId = 1;
let nextContactId = 1;

// TODO: Helper function for email validation

// TODO: Helper function for user validation

// TODO: Implement POST /api/users - Create new user

// TODO: Implement GET /api/users - List all users

// TODO: Implement PUT /api/users/:id - Update user

// TODO: Implement DELETE /api/users/:id - Delete user

// TODO: Implement POST /api/contact - Handle contact form

// TODO: Implement GET /api/contact - List contact submissions

// TODO: Implement POST /api/webhook - Handle raw webhook data

// TODO: Implement GET /api/webhook - List webhook logs

// TODO: Error handling middleware for body parsing errors

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Test these endpoints:');
    console.log('\\nJSON endpoints:');
    console.log('- POST /api/users (JSON body: {"name": "John", "email": "john@example.com", "age": 25})');
    console.log('- PUT /api/users/1 (JSON body: {"age": 26})');
    console.log('\\nForm endpoints:');
    console.log('- POST /api/contact (form data: name, email, subject, message)');
    console.log('\\nWebhook endpoints:');
    console.log('- POST /api/webhook (raw text or JSON)');
    console.log('\\nGET endpoints:');
    console.log('- GET /api/users');
    console.log('- GET /api/contact');
    console.log('- GET /api/webhook');
});
