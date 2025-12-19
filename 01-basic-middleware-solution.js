// Solution 1: Basic Middleware - Request logging, response modification, timing
import express from 'express';

const app = express();
const PORT = 3000;

// Built-in middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware: Request logger
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const ip = req.ip || req.connection.remoteAddress;
    
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
    next(); // Important: call next() to continue to the next middleware
};

// Custom middleware: Response time calculator
const responseTimer = (req, res, next) => {
    const startTime = Date.now();
    
    // Override the res.end method to capture when response finishes
    const originalEnd = res.end;
    res.end = function(...args) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        // Add response time to headers
        res.set('X-Response-Time', `${responseTime}ms`);
        
        console.log(`Response time: ${responseTime}ms for ${req.method} ${req.url}`);
        
        // Call the original end method
        originalEnd.apply(this, args);
    };
    
    next();
};

// Custom middleware: Add custom headers
const addCustomHeaders = (req, res, next) => {
    res.set({
        'X-API-Version': '1.0.0',
        'X-Powered-By': 'Express Learning Course',
        'X-Request-ID': `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    next();
};

// Custom middleware: Request body validator
const validateRequestBody = (req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Request body is required for this method',
                method: req.method,
                timestamp: new Date().toISOString()
            });
        }
    }
    next();
};

// Apply middleware in order (order matters!)
app.use(requestLogger);
app.use(responseTimer);
app.use(addCustomHeaders);
app.use(validateRequestBody);

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Express Middleware Demo!',
        timestamp: new Date().toISOString(),
        requestHeaders: req.headers,
        customHeaders: {
            'X-API-Version': res.get('X-API-Version'),
            'X-Powered-By': res.get('X-Powered-By'),
            'X-Request-ID': res.get('X-Request-ID')
        }
    });
});

app.get('/users', (req, res) => {
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    
    res.json({
        success: true,
        data: users,
        count: users.length
    });
});

app.post('/users', (req, res) => {
    const newUser = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
    });
});

app.get('/slow', (req, res) => {
    // Simulate slow endpoint to see response time middleware in action
    setTimeout(() => {
        res.json({
            message: 'This was a slow response',
            note: 'Check the X-Response-Time header!'
        });
    }, 2000);
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(500).json({
        error: 'Internal server error',
        requestId: res.get('X-Request-ID'),
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Middleware demonstration endpoints:');
    console.log('- GET / (basic info with headers)');
    console.log('- GET /users (sample data)');
    console.log('- POST /users (test body validation)');
    console.log('- GET /slow (test response timing)');
    console.log('\\nWatch the console for middleware logs!');
});
