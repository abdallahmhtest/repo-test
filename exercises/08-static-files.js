// Exercise 8: Static Files and Asset Serving
//
// TASK: Serve static files, handle caching, and create file management endpoints:
//
// 1. Setup static file serving:
//    - Create 'public' directory structure:
//      public/
//        css/
//        js/
//        images/
//        documents/
//    - Use express.static() middleware
//    - Serve files from multiple directories
//    - Set up proper MIME types
//
// 2. Create file upload endpoint POST /api/upload:
//    - Accept single file uploads
//    - Support different file types (images, documents, etc.)
//    - Validate file size and type
//    - Save files to appropriate directories
//    - Return file information and access URL
//
// 3. Create file management endpoints:
//    - GET /api/files - List all uploaded files
//    - GET /api/files/:filename - Get file metadata
//    - DELETE /api/files/:filename - Delete uploaded file
//    - GET /api/files/download/:filename - Force download
//
// 4. Implement caching strategies:
//    - Set Cache-Control headers for static assets
//    - Different cache times for different file types
//    - ETags for cache validation
//    - Handle If-None-Match headers
//
// 5. Create image resizing endpoint:
//    - GET /api/images/:filename/resize?width=200&height=200
//    - Resize images on demand (bonus: use sharp library)
//    - Cache resized images
//
// 6. Security features:
//    - Prevent directory traversal attacks
//    - Validate file extensions
//    - Set file size limits
//    - Sanitize filenames
//
// HINTS:
// - express.static() for serving static files
// - multer middleware for file uploads
// - fs module for file operations
// - path.extname() for file extension validation
// - res.download() for forcing downloads
// - res.set() for setting headers

import express from 'express';
import path from 'path';
import fs from 'fs';
// TODO: Import multer for file uploads

const app = express();
const PORT = 3007;

// TODO: Setup static file serving middleware

// TODO: Create upload directories if they don't exist

// TODO: Configure multer for file uploads

// TODO: File type validation helper

// TODO: Filename sanitization helper

// TODO: Cache control middleware

// TODO: Implement POST /api/upload - File upload

// TODO: Implement GET /api/files - List files

// TODO: Implement GET /api/files/:filename - File metadata

// TODO: Implement GET /api/files/download/:filename - Download file

// TODO: Implement DELETE /api/files/:filename - Delete file

// TODO: Implement GET /api/images/:filename/resize - Image resizing (bonus)

// TODO: Serve a simple HTML page for testing uploads

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>File Upload Test</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; }
                input[type="file"] { margin: 10px 0; }
                button { background: #007bff; color: white; padding: 10px 20px; border: none; cursor: pointer; }
                button:hover { background: #0056b3; }
            </style>
        </head>
        <body>
            <h1>File Upload and Static Files Test</h1>
            
            <div class="section">
                <h2>File Upload</h2>
                <form action="/api/upload" method="post" enctype="multipart/form-data">
                    <input type="file" name="file" required>
                    <button type="submit">Upload File</button>
                </form>
            </div>
            
            <div class="section">
                <h2>Test Links</h2>
                <ul>
                    <li><a href="/api/files">List all files</a></li>
                    <li><a href="/css/style.css">Sample CSS file</a></li>
                    <li><a href="/js/script.js">Sample JS file</a></li>
                    <li><a href="/images/sample.jpg">Sample image</a></li>
                </ul>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Test these endpoints:');
    console.log('\\nStatic files:');
    console.log('- GET / (upload test page)');
    console.log('- Static files served from /public');
    console.log('\\nFile management:');
    console.log('- POST /api/upload (file upload)');
    console.log('- GET /api/files (list files)');
    console.log('- GET /api/files/:filename (file info)');
    console.log('- GET /api/files/download/:filename (download)');
    console.log('- DELETE /api/files/:filename (delete)');
});
