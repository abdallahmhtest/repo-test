// Exercise 1: Basic Express Setup & Global Middleware
// 
// TASK: Create an Express server with the following requirements:
//
// 1. Set up a basic Express server on port 3000
// 2. Create a global middleware that:
//    - Logs each request with timestamp, method, and path
//    - Adds a custom property `requestId` to the request object
//    - Adds another custom property with any value you want
// 3. Create a performance timing middleware that:
//    - Records the start time of each request
//    - Logs the total response time when the request ends
// 4. Create two routes:
//    - GET / - returns a JSON response with welcome message and custom properties
//    - GET /slow - simulates a slow operation (2 second delay) then returns response
// 5. Test your endpoints and observe the console logs
//
// HINTS:
// - Use app.use() for global middleware
// - Use req.startTime = Date.now() to record time
// - Override res.end to calculate response time
// - Use setTimeout() to simulate slow operations

import express from 'express';

const app = express();
const PORT = 3000;

// TODO: Add your middleware and routes here

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));