// Solution 6: Request Body Parsing - JSON, Form Data, Raw Text
import express from 'express';

const app = express();
const PORT = 3005;

// Setup body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.text({ limit: '1mb' }));

// Create in-memory storage arrays
let users = [];
let contactSubmissions = [];
let webhookLogs = [];
let nextUserId = 1;
let nextContactId = 1;

// Helper function for email validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Helper function for user validation
const validateUser = (userData) => {
    const errors = [];
    
    if (!userData.name || typeof userData.name !== 'string' || userData.name.trim().length === 0) {
        errors.push('Name is required');
    } else if (userData.name.trim().length < 2 || userData.name.trim().length > 50) {
        errors.push('Name must be between 2 and 50 characters');
    }
    
    if (!userData.email || typeof userData.email !== 'string') {
        errors.push('Email is required');
    } else if (!isValidEmail(userData.email)) {
        errors.push('Invalid email format');
    } else if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        errors.push('Email already exists');
    }
    
    if (userData.age !== undefined) {
        if (typeof userData.age !== 'number' || userData.age < 18 || userData.age > 120) {
            errors.push('Age must be a number between 18 and 120');
        }
    }
    
    return errors;
};

// Implement POST /api/users - Create new user
app.post('/api/users', (req, res) => {
    const errors = validateUser(req.body);
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }
    
    const user = {
        id: nextUserId++,
        name: req.body.name.trim(),
        email: req.body.email.toLowerCase().trim(),
        age: req.body.age,
        address: req.body.address || {},
        createdAt: new Date().toISOString()
    };
    
    users.push(user);
    
    res.status(201).json({
        success: true,
        message: 'User created successfully',
        user
    });
});

// Implement GET /api/users - List all users
app.get('/api/users', (req, res) => {
    res.json({
        success: true,
        count: users.length,
        users
    });
});

// Implement PUT /api/users/:id - Update user
app.put('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    // Validate only provided fields
    const updates = {};
    const errors = [];
    
    if (req.body.name !== undefined) {
        if (!req.body.name || req.body.name.trim().length < 2 || req.body.name.trim().length > 50) {
            errors.push('Name must be between 2 and 50 characters');
        } else {
            updates.name = req.body.name.trim();
        }
    }
    
    if (req.body.email !== undefined) {
        if (!isValidEmail(req.body.email)) {
            errors.push('Invalid email format');
        } else {
            const existingUser = users.find(u => u.email.toLowerCase() === req.body.email.toLowerCase() && u.id !== userId);
            if (existingUser) {
                errors.push('Email already exists');
            } else {
                updates.email = req.body.email.toLowerCase().trim();
            }
        }
    }
    
    if (req.body.age !== undefined) {
        if (typeof req.body.age !== 'number' || req.body.age < 18 || req.body.age > 120) {
            errors.push('Age must be a number between 18 and 120');
        } else {
            updates.age = req.body.age;
        }
    }
    
    if (req.body.address !== undefined) {
        updates.address = req.body.address;
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }
    
    // Apply updates
    users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() };
    
    res.json({
        success: true,
        message: 'User updated successfully',
        user: users[userIndex]
    });
});

// Implement DELETE /api/users/:id - Delete user
app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.json({
        success: true,
        message: 'User deleted successfully',
        user: deletedUser
    });
});

// Implement POST /api/contact - Handle contact form
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    const errors = [];
    
    if (!name || name.trim().length === 0) {
        errors.push('Name is required');
    }
    
    if (!email || !isValidEmail(email)) {
        errors.push('Valid email is required');
    }
    
    if (!subject || subject.trim().length === 0) {
        errors.push('Subject is required');
    }
    
    if (!message || message.trim().length === 0) {
        errors.push('Message is required');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }
    
    const submission = {
        id: nextContactId++,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        subject: subject.trim(),
        message: message.trim(),
        submittedAt: new Date().toISOString()
    };
    
    contactSubmissions.push(submission);
    
    res.status(201).json({
        success: true,
        message: 'Contact form submitted successfully',
        submissionId: submission.id
    });
});

// Implement GET /api/contact - List contact submissions
app.get('/api/contact', (req, res) => {
    res.json({
        success: true,
        count: contactSubmissions.length,
        submissions: contactSubmissions
    });
});

// Implement POST /api/webhook - Handle raw webhook data
app.post('/api/webhook', (req, res) => {
    let payload = req.body;
    let parsedData = null;
    let dataType = 'unknown';
    
    // Determine content type
    const contentType = req.get('Content-Type') || '';
    
    if (contentType.includes('application/json')) {
        dataType = 'json';
        parsedData = payload;
    } else if (typeof payload === 'string') {
        dataType = 'text';
        try {
            // Try to parse as JSON
            parsedData = JSON.parse(payload);
            dataType = 'json-string';
        } catch (e) {
            parsedData = payload;
        }
    }
    
    const webhookLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        contentType,
        dataType,
        payload,
        parsedData,
        size: JSON.stringify(payload).length,
        headers: {
            'user-agent': req.get('User-Agent'),
            'content-length': req.get('Content-Length')
        }
    };
    
    webhookLogs.push(webhookLog);
    
    console.log('Webhook received:', {
        type: dataType,
        size: webhookLog.size,
        timestamp: webhookLog.timestamp
    });
    
    res.json({
        success: true,
        message: 'Webhook processed successfully',
        received: {
            type: dataType,
            size: webhookLog.size,
            timestamp: webhookLog.timestamp
        }
    });
});

// Implement GET /api/webhook - List webhook logs
app.get('/api/webhook', (req, res) => {
    res.json({
        success: true,
        count: webhookLogs.length,
        logs: webhookLogs.slice(-10) // Return last 10 logs
    });
});

// Error handling middleware for body parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON format',
            error: 'Malformed JSON in request body'
        });
    }
    
    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            success: false,
            message: 'Request body too large',
            error: 'Request body exceeds size limit'
        });
    }
    
    next(err);
});

// Generic error handler
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

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
