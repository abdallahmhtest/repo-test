// Exercise 4: URL Parameters & Route Parameters
//
// TASK: Create various route patterns demonstrating different URL parameter features:
//
// 1. Basic route parameters:
//    - GET /products/:category/:id - extract category and product ID
//    - Return both parameters and a formatted message
//
// 2. Optional parameters:
//    - GET /blog/:year/:month?/:day? - year required, month and day optional
//    - Handle all combinations (year only, year+month, year+month+day)
//
// 3. Wildcard/splat parameters:
//    - GET /files/* - capture entire file path after /files/
//    - Parse the path into segments and extract filename
//
// 4. Pattern matching with regex:
//    - GET /user/:id(\\d+) - only accept numeric IDs
//    - GET /user/:name([a-zA-Z]+) - only accept letter-only names
//    - GET /item/:code(\\w{3}-\\d{3}) - accept format like ABC-123
//
// 5. Custom parameter patterns:
//    - GET /compare/:id1-vs-:id2 - compare two items
//    - GET /coordinates/:lat,:lng - geographic coordinates
//    - GET /api/v:version(\\d+)/:resource - versioned API endpoints
//
// 6. Nested resource patterns:
//    - GET /users/:userId/posts/:postId/comments/:commentId? - hierarchical resources
//
// 7. Parameter validation middleware:
//    - Create middleware that validates numeric IDs and converts them to integers
//    - Use it on GET /validated/:id
//
// 8. Add a catch-all route that lists all available patterns
//
// HINTS:
// - Use req.params to access route parameters
// - Optional parameters use ? after parameter name
// - Regex patterns go in parentheses after parameter name
// - Use req.params[0] for wildcard matches
// - Split strings with split('/') to get path segments

import express from 'express';

const app = express();
const PORT = 3003;

// TODO: Create all the route patterns described above

// TODO: Add parameter validation middleware

// TODO: Add catch-all route for undefined paths

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Test these URL patterns:');
    console.log('- /products/electronics/123');
    console.log('- /blog/2023 or /blog/2023/12 or /blog/2023/12/25');
    console.log('- /files/documents/reports/annual.pdf');
    console.log('- /user/123 or /user/john');
    console.log('- /item/ABC-123');
    console.log('- /compare/laptop-vs-desktop');
    console.log('- /coordinates/40.7128,-74.0060');
    console.log('- /api/v1/users');
    console.log('- /users/1/posts/5/comments/10');
    console.log('- /validated/42');
});