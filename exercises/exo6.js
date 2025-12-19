// Exercise 6: Forms and File Upload with Multer
//
// TASK: Handle complex forms with file uploads, validation, and processing:
//
// 1. Setup advanced file upload handling:
//    - Use multer with different storage engines
//    - Support single and multiple file uploads
//    - Handle different form field types
//    - Implement file filtering and validation
//
// 2. Create user profile form POST /api/profile:
//    - Fields: name, email, bio, avatar (file)
//    - Validate text fields and file requirements
//    - Save avatar to uploads/avatars/
//    - Generate thumbnail version of avatar
//    - Return profile data with file URLs
//
// 3. Create document upload form POST /api/documents:
//    - Support multiple file upload (up to 5 files)
//    - Accept only PDF, DOC, DOCX files
//    - Validate file sizes (max 10MB each)
//    - Organize files by upload date
//    - Return upload summary with file details
//
// 4. Create gallery upload POST /api/gallery:
//    - Support multiple image uploads
//    - Accept only JPG, PNG, GIF, WEBP
//    - Create different sizes (thumbnail, medium, large)
//    - Organize by date and generate metadata
//    - Return gallery with image URLs
//
// 5. Form validation and processing:
//    - Validate required fields before file processing
//    - Handle partial upload failures
//    - Clean up files on validation errors
//    - Provide detailed error messages
//
// 6. File management features:
//    - GET /api/profiles - List all profiles
//    - GET /api/documents - List documents with filters
//    - GET /api/gallery - List gallery images
//    - DELETE endpoints for cleanup
//
// HINTS:
// - multer.diskStorage() for custom file naming
// - multer.memoryStorage() for processing before saving
// - File filtering with fileFilter function
// - path.join() for safe file paths
// - Date-based directory organization
// - Image processing libraries (sharp, jimp)

import express from 'express';
import path from 'path';
import fs from 'fs';
// TODO: Import multer and configure storage

const app = express();
const PORT = 3008;

// TODO: Setup JSON and URL-encoded middleware

// TODO: Create upload directories structure

// TODO: Configure multer storage engines

// TODO: File validation helpers

// TODO: Image processing helpers (thumbnail generation)

// TODO: Directory organization helpers

// TODO: Implement POST /api/profile - User profile with avatar

// TODO: Implement GET /api/profiles - List all profiles

// TODO: Implement PUT /api/profile/:id - Update profile

// TODO: Implement POST /api/documents - Multiple document upload

// TODO: Implement GET /api/documents - List documents with filtering

// TODO: Implement POST /api/gallery - Multiple image upload with processing

// TODO: Implement GET /api/gallery - List gallery images

// TODO: Implement DELETE /api/profile/:id - Delete profile and avatar

// TODO: Implement DELETE /api/documents/:filename - Delete document

// TODO: Implement DELETE /api/gallery/:filename - Delete gallery image

// TODO: Error handling for multer errors

// TODO: Serve upload form for testing
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Advanced File Upload Forms</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; }
                .form-section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                .form-group { margin: 15px 0; }
                label { display: block; margin-bottom: 5px; font-weight: bold; }
                input, textarea, select { width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; }
                button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; }
                button:hover { background: #0056b3; }
                .file-info { font-size: 0.9em; color: #666; }
            </style>
        </head>
        <body>
            <h1>Advanced File Upload Forms</h1>
            
            <div class="form-section">
                <h2>User Profile Form</h2>
                <form action="/api/profile" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label>Name:</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Bio:</label>
                        <textarea name="bio" rows="4"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Avatar Image:</label>
                        <input type="file" name="avatar" accept="image/*" required>
                        <div class="file-info">JPG, PNG, GIF only. Max 5MB.</div>
                    </div>
                    <button type="submit">Create Profile</button>
                </form>
            </div>
            
            <div class="form-section">
                <h2>Document Upload</h2>
                <form action="/api/documents" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label>Title:</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="form-group">
                        <label>Description:</label>
                        <textarea name="description" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Documents (up to 5):</label>
                        <input type="file" name="documents" multiple accept=".pdf,.doc,.docx" required>
                        <div class="file-info">PDF, DOC, DOCX only. Max 10MB each.</div>
                    </div>
                    <button type="submit">Upload Documents</button>
                </form>
            </div>
            
            <div class="form-section">
                <h2>Gallery Upload</h2>
                <form action="/api/gallery" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label>Gallery Title:</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="form-group">
                        <label>Images:</label>
                        <input type="file" name="images" multiple accept="image/*" required>
                        <div class="file-info">JPG, PNG, GIF, WEBP. Max 5MB each.</div>
                    </div>
                    <button type="submit">Create Gallery</button>
                </form>
            </div>
            
            <div class="form-section">
                <h2>View Uploaded Content</h2>
                <ul>
                    <li><a href="/api/profiles">View All Profiles</a></li>
                    <li><a href="/api/documents">View All Documents</a></li>
                    <li><a href="/api/gallery">View Gallery</a></li>
                </ul>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Test these endpoints:');
    console.log('\\nForms:');
    console.log('- GET / (test forms page)');
    console.log('- POST /api/profile (profile with avatar)');
    console.log('- POST /api/documents (multiple documents)');
    console.log('- POST /api/gallery (multiple images)');
    console.log('\\nViewing:');
    console.log('- GET /api/profiles');
    console.log('- GET /api/documents');
    console.log('- GET /api/gallery');
});
