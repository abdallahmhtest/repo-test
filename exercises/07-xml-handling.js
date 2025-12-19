// Exercise 7: XML Handling - Parsing and Converting XML Data
//
// TASK: Handle XML data parsing, conversion, and API responses:
//
// 1. Setup XML parsing:
//    - Install and use xml2js library for XML parsing
//    - Create middleware to parse XML from request body
//    - Handle XML to JSON conversion
//    - Support both XML input and output formats
//
// 2. Create POST /api/xml/users endpoint:
//    - Accept XML user data in this format:
//      <?xml version="1.0" encoding="UTF-8"?>
//      <user>
//          <name>John Doe</name>
//          <email>john@example.com</email>
//          <age>25</age>
//          <address>
//              <street>123 Main St</street>
//              <city>New York</city>
//              <country>USA</country>
//          </address>
//      </user>
//    - Parse XML to JavaScript object
//    - Validate and save user data
//    - Return XML or JSON response based on Accept header
//
// 3. Create GET /api/xml/users endpoint:
//    - Return users in XML format by default
//    - Support query parameter ?format=json for JSON response
//    - Support query parameter ?format=xml for XML response
//    - Include proper XML headers and structure
//
// 4. Create POST /api/xml/import endpoint:
//    - Accept XML with multiple users:
//      <?xml version="1.0" encoding="UTF-8"?>
//      <users>
//          <user>...</user>
//          <user>...</user>
//      </users>
//    - Bulk import multiple users
//    - Return import summary (success count, errors)
//
// 5. Create middleware for content negotiation:
//    - Check Accept header to determine response format
//    - Support application/xml and application/json
//    - Default to JSON if no preference specified
//
// 6. Error handling:
//    - Handle XML parsing errors
//    - Handle malformed XML structure
//    - Return errors in requested format (XML/JSON)
//
// HINTS:
// - npm install xml2js for XML parsing
// - Use xml2js.parseString() to parse XML
// - Use xml2js.Builder() to generate XML
// - req.get('Content-Type') to check request type
// - req.get('Accept') for response format negotiation
// - Set res.set('Content-Type', 'application/xml') for XML responses

import express from 'express';
// TODO: Import xml2js library

const app = express();
const PORT = 3006;

// TODO: Setup middleware for JSON and XML parsing

// TODO: Create in-memory storage
let users = [];
let nextUserId = 1;

// TODO: XML parsing middleware

// TODO: Content negotiation middleware

// TODO: Helper function to convert object to XML

// TODO: Helper function to validate user data

// TODO: Implement POST /api/xml/users - Create user from XML

// TODO: Implement GET /api/xml/users - Return users in XML/JSON

// TODO: Implement GET /api/xml/users/:id - Get single user

// TODO: Implement POST /api/xml/import - Bulk import users

// TODO: Implement DELETE /api/xml/users/:id - Delete user

// TODO: Error handling for XML parsing

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Test these endpoints:');
    console.log('\\nXML endpoints:');
    console.log('- POST /api/xml/users (XML body with user data)');
    console.log('- POST /api/xml/import (XML body with multiple users)');
    console.log('- GET /api/xml/users (returns XML by default)');
    console.log('- GET /api/xml/users?format=json (returns JSON)');
    console.log('\\nContent-Type headers to test:');
    console.log('- Content-Type: application/xml');
    console.log('- Accept: application/xml or application/json');
});
