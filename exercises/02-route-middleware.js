// Exercise 2: Route-specific Middleware
//
// TASK: Create route-specific middleware with the following requirements:
//
// 1. Create an authentication middleware that:
//    - Checks for 'Authorization' header with value 'Bearer secret123'
//    - If valid, adds user object to req.user = { id: 1, name: 'John Doe', role: 'admin' }
//    - If invalid, returns 401 Unauthorized error
//
// 2. Create an admin middleware that:
//    - Checks if req.user exists and has role 'admin'
//    - If not admin, returns 403 Forbidden error
//
// 3. Create a rate limiting middleware that:
//    - Allows max 3 requests per 30 seconds per IP
//    - Returns 429 Too Many Requests if limit exceeded
//    - Use a Map to store request counts per IP
//
// 4. Create these routes:
//    - GET /public - no middleware needed
//    - GET /protected - requires authentication
//    - GET /admin - requires authentication + admin role
//    - GET /limited - has rate limiting (3 requests per 30 seconds)
//    - GET /multi - uses multiple middleware in sequence
//
// 5. Test all routes with and without proper headers
//
// HINTS:
// - Use req.headers.authorization for auth header
// - Use req.ip or req.connection.remoteAddress for client IP
// - Middleware functions have (req, res, next) signature
// - Call next() to continue to next middleware
// - Multiple middleware: app.get('/path', middleware1, middleware2, handler)

import express from 'express';

const app = express();
const PORT = 3001;

// TODO: Create your middleware functions here

// TODO: Create your routes here

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Test endpoints:');
    console.log('- GET /public (no auth needed)');
    console.log('- GET /protected (needs: Authorization: Bearer secret123)');
    console.log('- GET /admin (needs auth + admin role)');
    console.log('- GET /limited (rate limited - try more than 3 requests)');
    console.log('- GET /multi (multiple middleware)');
});