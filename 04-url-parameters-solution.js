// Solution 4: URL Parameters & Route Parameters
import express from 'express';

const app = express();
const PORT = 3003;

// Basic route parameters
app.get('/products/:category/:id', (req, res) => {
    const { category, id } = req.params;
    
    res.json({
        category,
        productId: id,
        message: `Viewing product ${id} in category ${category}`,
        params: req.params,
        url: req.url,
        originalUrl: req.originalUrl
    });
});

// Optional parameters
app.get('/blog/:year/:month?/:day?', (req, res) => {
    const { year, month, day } = req.params;
    
    let message = `Posts from year ${year}`;
    if (month) message += `, month ${month}`;
    if (day) message += `, day ${day}`;
    
    res.json({
        year,
        month: month || null,
        day: day || null,
        message,
        dateComponents: {
            hasYear: !!year,
            hasMonth: !!month,
            hasDay: !!day
        }
    });
});

// Wildcard parameters (splat)
app.get('/files/*', (req, res) => {
    const filepath = req.params[0];
    const pathSegments = filepath.split('/').filter(Boolean);
    
    res.json({
        fullPath: filepath,
        segments: pathSegments,
        fileName: pathSegments[pathSegments.length - 1] || null,
        directory: pathSegments.slice(0, -1).join('/') || '/',
        message: `Accessing file: ${filepath}`
    });
});

// Pattern matching with regex - numeric ID only
app.get('/user/:id(\\d+)', (req, res) => {
    res.json({
        userId: parseInt(req.params.id),
        message: 'User ID must be numeric',
        type: 'number'
    });
});

// String pattern for user names - letters only
app.get('/user/:name([a-zA-Z]+)', (req, res) => {
    res.json({
        userName: req.params.name,
        message: 'User name must contain only letters',
        type: 'string'
    });
});

// Complex pattern matching - item codes
app.get('/item/:code(\\w{3}-\\d{3})', (req, res) => {
    res.json({
        itemCode: req.params.code,
        message: 'Item code format: 3 letters + dash + 3 numbers',
        example: 'ABC-123'
    });
});

// Custom separators - comparison
app.get('/compare/:id1-vs-:id2', (req, res) => {
    const { id1, id2 } = req.params;
    
    res.json({
        comparison: {
            item1: id1,
            item2: id2
        },
        message: `Comparing ${id1} vs ${id2}`,
        sameItem: id1 === id2
    });
});

// Coordinates with comma separator
app.get('/coordinates/:lat,:lng', (req, res) => {
    const { lat, lng } = req.params;
    
    res.json({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        coordinates: `${lat}, ${lng}`,
        valid: !isNaN(lat) && !isNaN(lng),
        message: 'Geographic coordinates'
    });
});

// Versioned API endpoints
app.get('/api/v:version(\\d+)/:resource', (req, res) => {
    const { version, resource } = req.params;
    
    res.json({
        apiVersion: parseInt(version),
        resource,
        endpoint: `/api/v${version}/${resource}`,
        message: `API version ${version} - accessing ${resource}`
    });
});

// Nested resource patterns
app.get('/users/:userId/posts/:postId/comments/:commentId?', (req, res) => {
    const { userId, postId, commentId } = req.params;
    
    res.json({
        userId,
        postId,
        commentId: commentId || null,
        hierarchy: [
            { level: 'user', id: userId },
            { level: 'post', id: postId },
            ...(commentId ? [{ level: 'comment', id: commentId }] : [])
        ],
        message: commentId 
            ? `Comment ${commentId} on post ${postId} by user ${userId}`
            : `Post ${postId} by user ${userId}`
    });
});

// Complex route with multiple optional segments
app.get('/search/:category/:subcategory?/:brand?/:model?', (req, res) => {
    const { category, subcategory, brand, model } = req.params;
    
    const breadcrumbs = [category];
    if (subcategory) breadcrumbs.push(subcategory);
    if (brand) breadcrumbs.push(brand);
    if (model) breadcrumbs.push(model);
    
    res.json({
        category,
        subcategory: subcategory || null,
        brand: brand || null,
        model: model || null,
        breadcrumbs,
        depth: breadcrumbs.length,
        searchPath: breadcrumbs.join(' > ')
    });
});

// Route parameter validation with custom middleware
const validateNumericId = (req, res, next) => {
    const id = req.params.id;
    if (!/^\d+$/.test(id)) {
        return res.status(400).json({
            error: 'Invalid ID format',
            expected: 'numeric',
            received: id
        });
    }
    req.params.id = parseInt(id);
    next();
};

app.get('/validated/:id', validateNumericId, (req, res) => {
    res.json({
        id: req.params.id,
        type: typeof req.params.id,
        message: 'ID successfully validated and converted to number'
    });
});

// Catch-all route for demonstration
app.get('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
        method: req.method,
        availableRoutes: [
            '/products/:category/:id',
            '/blog/:year/:month?/:day?',
            '/files/*',
            '/user/:id (numeric)',
            '/user/:name (letters only)',
            '/item/:code (ABC-123 format)',
            '/compare/:id1-vs-:id2',
            '/coordinates/:lat,:lng',
            '/api/v:version/:resource',
            '/users/:userId/posts/:postId/comments/:commentId?',
            '/search/:category/:subcategory?/:brand?/:model?',
            '/validated/:id'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('\nTest these URL patterns:');
    console.log('- /products/electronics/123');
    console.log('- /blog/2023/12/25 or /blog/2023/12 or /blog/2023');
    console.log('- /files/documents/reports/annual.pdf');
    console.log('- /user/123 (numeric ID)');
    console.log('- /user/john (string name)');
    console.log('- /item/ABC-123 (pattern match)');
    console.log('- /compare/laptop-vs-desktop');
    console.log('- /coordinates/40.7128,-74.0060');
    console.log('- /api/v1/users or /api/v2/posts');
    console.log('- /users/1/posts/5/comments/10');
    console.log('- /search/electronics/laptops/apple/macbook');
    console.log('- /validated/42 (validated numeric)');
});