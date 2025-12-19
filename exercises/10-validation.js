// Exercise 10: Data Validation with express-validator
//
// TASK: Implement comprehensive data validation using express-validator:
//
// 1. Setup express-validator:
//    - Import validation functions and middleware
//    - Create reusable validation chains
//    - Handle validation errors properly
//    - Create custom validators
//
// 2. Create user registration endpoint POST /api/register:
//    - Validate: name (2-50 chars), email (valid format), password (8+ chars, complexity)
//    - Custom validations: unique email, password confirmation match
//    - Sanitize: trim whitespace, normalize email, escape HTML
//    - Return detailed validation errors
//
// 3. Create product creation endpoint POST /api/products:
//    - Validate: name, description, price (positive number), category
//    - Optional fields: tags (array), features (object), images (URLs)
//    - Custom validations: category exists, price range, URL format
//    - Conditional validation: discount requires valid dates
//
// 4. Create user profile update PUT /api/users/:id:
//    - Optional field validation (only validate provided fields)
//    - Age validation (18-120), phone format, social media URLs
//    - Custom validator: check if user exists
//    - Sanitization: clean HTML input, format phone numbers
//
// 5. Create comment system POST /api/posts/:id/comments:
//    - Validate: content (required, max length), rating (1-5)
//    - Optional: author email, website URL
//    - Rate limiting validation: max 3 comments per hour per IP
//    - Content moderation: block profanity, spam patterns
//
// 6. Advanced validation features:
//    - Chain multiple validations
//    - Conditional validation based on other fields
//    - Custom error messages with field-specific details
//    - Validation middleware that can be reused
//
// HINTS:
// - Import from 'express-validator': body, param, query, validationResult
// - Use .isEmail(), .isLength(), .isNumeric(), .isURL()
// - Custom validators with .custom() method
// - .sanitize() methods for data cleaning
// - validationResult(req) to get validation errors
// - .bail() to stop validation chain on first error

import express from 'express';
// TODO: Import express-validator functions

const app = express();
const PORT = 3009;

app.use(express.json());

// TODO: Create mock data storage
let users = [];
let products = [];
let posts = [];
let categories = ['electronics', 'clothing', 'books', 'home', 'sports'];
let nextUserId = 1;
let nextProductId = 1;
let nextPostId = 1;

// TODO: Create reusable validation middleware

// TODO: Custom validators

// TODO: Validation error handler middleware

// TODO: User registration validation rules

// TODO: Implement POST /api/register with validation

// TODO: Product validation rules

// TODO: Implement POST /api/products with validation

// TODO: User update validation rules

// TODO: Implement PUT /api/users/:id with validation

// TODO: Comment validation rules

// TODO: Implement POST /api/posts/:id/comments with validation

// TODO: Create some test posts for commenting
app.post('/api/posts', (req, res) => {
    const post = {
        id: nextPostId++,
        title: req.body.title,
        content: req.body.content,
        comments: []
    };
    posts.push(post);
    res.status(201).json(post);
});

// TODO: Get endpoints for testing
app.get('/api/users', (req, res) => {
    res.json(users);
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/posts', (req, res) => {
    res.json(posts);
});

app.get('/api/categories', (req, res) => {
    res.json(categories);
});

// TODO: Test page with forms
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Validation Testing</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; }
                .form-section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                .form-group { margin: 15px 0; }
                label { display: block; margin-bottom: 5px; font-weight: bold; }
                input, textarea, select { width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; }
                button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; }
                button:hover { background: #0056b3; }
                .validation-info { font-size: 0.9em; color: #666; margin-top: 5px; }
                .error { color: #dc3545; }
                .success { color: #28a745; }
            </style>
        </head>
        <body>
            <h1>Data Validation Testing</h1>
            
            <div class="form-section">
                <h2>User Registration</h2>
                <form id="registerForm">
                    <div class="form-group">
                        <label>Name:</label>
                        <input type="text" name="name" required>
                        <div class="validation-info">2-50 characters</div>
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" required>
                        <div class="validation-info">Valid email format, must be unique</div>
                    </div>
                    <div class="form-group">
                        <label>Password:</label>
                        <input type="password" name="password" required>
                        <div class="validation-info">8+ chars, must include uppercase, lowercase, number</div>
                    </div>
                    <div class="form-group">
                        <label>Confirm Password:</label>
                        <input type="password" name="confirmPassword" required>
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
            
            <div class="form-section">
                <h2>Create Product</h2>
                <form id="productForm">
                    <div class="form-group">
                        <label>Name:</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Description:</label>
                        <textarea name="description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Price:</label>
                        <input type="number" name="price" step="0.01" required>
                        <div class="validation-info">Must be positive</div>
                    </div>
                    <div class="form-group">
                        <label>Category:</label>
                        <select name="category" required>
                            <option value="">Select category</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="books">Books</option>
                            <option value="home">Home</option>
                            <option value="sports">Sports</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Tags (comma-separated):</label>
                        <input type="text" name="tags">
                    </div>
                    <button type="submit">Create Product</button>
                </form>
            </div>
            
            <div class="form-section">
                <h2>View Data</h2>
                <ul>
                    <li><a href="/api/users">View Users</a></li>
                    <li><a href="/api/products">View Products</a></li>
                    <li><a href="/api/posts">View Posts</a></li>
                    <li><a href="/api/categories">View Categories</a></li>
                </ul>
            </div>
            
            <script>
                // Simple form submission with fetch
                document.getElementById('registerForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData);
                    
                    try {
                        const response = await fetch('/api/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });
                        const result = await response.json();
                        
                        if (response.ok) {
                            alert('Registration successful!');
                            e.target.reset();
                        } else {
                            alert('Validation errors: ' + JSON.stringify(result.errors, null, 2));
                        }
                    } catch (error) {
                        alert('Error: ' + error.message);
                    }
                });
                
                document.getElementById('productForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData);
                    
                    // Convert tags to array
                    if (data.tags) {
                        data.tags = data.tags.split(',').map(tag => tag.trim());
                    }
                    
                    try {
                        const response = await fetch('/api/products', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });
                        const result = await response.json();
                        
                        if (response.ok) {
                            alert('Product created successfully!');
                            e.target.reset();
                        } else {
                            alert('Validation errors: ' + JSON.stringify(result.errors, null, 2));
                        }
                    } catch (error) {
                        alert('Error: ' + error.message);
                    }
                });
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Test validation endpoints:');
    console.log('\\nValidation endpoints:');
    console.log('- POST /api/register (user registration)');
    console.log('- POST /api/products (product creation)');
    console.log('- PUT /api/users/:id (user update)');
    console.log('- POST /api/posts/:id/comments (comment creation)');
    console.log('\\nTest invalid data to see validation errors');
    console.log('- GET / (testing forms)');
});
