// Solution 2: Route-specific Middleware - Authentication, authorization, caching
import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock user database
const users = [
    { id: 1, username: 'admin', role: 'admin', apiKey: 'admin123' },
    { id: 2, username: 'user', role: 'user', apiKey: 'user456' },
    { id: 3, username: 'guest', role: 'guest', apiKey: 'guest789' }
];

// Mock cache storage
const cache = new Map();

// Authentication middleware
const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
        return res.status(401).json({
            error: 'API key required',
            message: 'Please provide X-API-Key header'
        });
    }
    
    const user = users.find(u => u.apiKey === apiKey);
    if (!user) {
        return res.status(401).json({
            error: 'Invalid API key',
            message: 'The provided API key is not valid'
        });
    }
    
    // Attach user to request object
    req.user = user;
    next();
};

// Authorization middleware factory
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'Please authenticate first'
            });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                message: `Required roles: ${roles.join(', ')}. Your role: ${req.user.role}`,
                userRole: req.user.role,
                requiredRoles: roles
            });
        }
        
        next();
    };
};

// Caching middleware factory
const cacheMiddleware = (duration = 300) => { // default 5 minutes
    return (req, res, next) => {
        const key = req.originalUrl;
        const cached = cache.get(key);
        
        if (cached && (Date.now() - cached.timestamp) < duration * 1000) {
            console.log(`Cache HIT for ${key}`);
            res.set('X-Cache', 'HIT');
            res.set('X-Cache-Age', Math.floor((Date.now() - cached.timestamp) / 1000));
            return res.json(cached.data);
        }
        
        console.log(`Cache MISS for ${key}`);
        res.set('X-Cache', 'MISS');
        
        // Override res.json to cache the response
        const originalJson = res.json;
        res.json = function(data) {
            cache.set(key, {
                data: data,
                timestamp: Date.now()
            });
            
            // Clean up old cache entries (simple cleanup)
            if (cache.size > 50) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }
            
            originalJson.call(this, data);
        };
        
        next();
    };
};

// Rate limiting middleware
const rateLimit = (maxRequests = 10, windowMs = 60000) => {
    const requests = new Map();
    
    return (req, res, next) => {
        const key = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        const windowStart = now - windowMs;
        
        // Get existing requests for this IP
        const userRequests = requests.get(key) || [];
        
        // Filter out old requests
        const recentRequests = userRequests.filter(time => time > windowStart);
        
        if (recentRequests.length >= maxRequests) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: `Maximum ${maxRequests} requests per ${windowMs / 1000} seconds`,
                retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
            });
        }
        
        // Add current request
        recentRequests.push(now);
        requests.set(key, recentRequests);
        
        // Add rate limit headers
        res.set({
            'X-Rate-Limit': maxRequests,
            'X-Rate-Limit-Remaining': maxRequests - recentRequests.length,
            'X-Rate-Limit-Reset': new Date(windowStart + windowMs).toISOString()
        });
        
        next();
    };
};

// Routes

// Public route (no middleware)
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Route Middleware Demo!',
        endpoints: {
            public: ['GET /'],
            authenticated: ['GET /profile', 'GET /data'],
            adminOnly: ['GET /admin', 'DELETE /admin/users/:id'],
            cached: ['GET /data', 'GET /heavy-computation'],
            rateLimited: ['POST /api/submit']
        },
        authentication: 'Use X-API-Key header (admin123, user456, or guest789)'
    });
});

// Authenticated route
app.get('/profile', authenticate, (req, res) => {
    res.json({
        message: 'Your profile information',
        user: {
            id: req.user.id,
            username: req.user.username,
            role: req.user.role
        },
        timestamp: new Date().toISOString()
    });
});

// Cached data route (auth required)
app.get('/data', authenticate, cacheMiddleware(60), (req, res) => {
    // Simulate expensive operation
    const data = {
        timestamp: new Date().toISOString(),
        data: Array.from({ length: 100 }, (_, i) => ({
            id: i + 1,
            value: Math.random() * 1000,
            processed: new Date().toISOString()
        })),
        user: req.user.username,
        note: 'This response is cached for 60 seconds'
    };
    
    res.json(data);
});

// Admin-only routes
app.get('/admin', authenticate, authorize('admin'), (req, res) => {
    res.json({
        message: 'Admin dashboard',
        users: users.map(u => ({ id: u.id, username: u.username, role: u.role })),
        cacheSize: cache.size,
        timestamp: new Date().toISOString()
    });
});

app.delete('/admin/users/:id', authenticate, authorize('admin'), (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({
            error: 'User not found',
            userId: userId
        });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    res.json({
        message: 'User deleted successfully',
        deletedUser: { id: deletedUser.id, username: deletedUser.username },
        remainingUsers: users.length
    });
});

// Heavy computation route (cached)
app.get('/heavy-computation', cacheMiddleware(120), (req, res) => {
    // Simulate heavy computation
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += Math.sqrt(i);
    }
    
    res.json({
        result: result,
        computation: 'Square root sum of 1,000,000 numbers',
        timestamp: new Date().toISOString(),
        note: 'This result is cached for 120 seconds'
    });
});

// Rate limited route
app.post('/api/submit', rateLimit(5, 60000), (req, res) => {
    res.json({
        message: 'Data submitted successfully',
        submittedData: req.body,
        timestamp: new Date().toISOString(),
        note: 'This endpoint allows maximum 5 requests per minute'
    });
});

// Route with multiple middleware
app.get('/secure-data', 
    authenticate, 
    authorize('admin', 'user'), 
    cacheMiddleware(30),
    (req, res) => {
        res.json({
            message: 'Secure cached data',
            user: req.user.username,
            securityLevel: req.user.role === 'admin' ? 'high' : 'medium',
            data: {
                secret: 'This is sensitive information',
                accessTime: new Date().toISOString(),
                accessCount: Math.floor(Math.random() * 100)
            }
        });
    }
);

// Clear cache route (admin only)
app.delete('/admin/cache', authenticate, authorize('admin'), (req, res) => {
    const cacheSize = cache.size;
    cache.clear();
    
    res.json({
        message: 'Cache cleared successfully',
        clearedEntries: cacheSize,
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        method: req.method,
        url: req.url
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('\\nAPI Keys for testing:');
    console.log('- admin123 (admin role)');
    console.log('- user456 (user role)');
    console.log('- guest789 (guest role)');
    console.log('\\nTest endpoints:');
    console.log('- GET / (public)');
    console.log('- GET /profile (auth required)');
    console.log('- GET /data (auth + cached)');
    console.log('- GET /admin (admin only)');
    console.log('- POST /api/submit (rate limited)');
});
