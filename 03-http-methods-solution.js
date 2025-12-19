// Solution 3: HTTP Methods - CRUD Operations
import express from 'express';

const app = express();
const PORT = 3002;

// Middleware
app.use(express.json());

// In-memory database
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, createdAt: '2023-01-01T00:00:00.000Z' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, createdAt: '2023-01-02T00:00:00.000Z' }
];
let nextId = 3;

// GET - Read all users (with optional filtering)
app.get('/users', (req, res) => {
    let filteredUsers = users;
    
    // Filter by name (partial match)
    if (req.query.name) {
        filteredUsers = filteredUsers.filter(u => 
            u.name.toLowerCase().includes(req.query.name.toLowerCase())
        );
    }
    
    // Filter by minimum age
    if (req.query.minAge) {
        filteredUsers = filteredUsers.filter(u => u.age >= parseInt(req.query.minAge));
    }
    
    res.json({
        users: filteredUsers,
        total: filteredUsers.length,
        allUsers: users.length
    });
});

// GET - Read single user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({ 
            error: 'User not found',
            availableIds: users.map(u => u.id)
        });
    }
    
    res.json(user);
});

// POST - Create new user
app.post('/users', (req, res) => {
    const { name, email, age } = req.body;
    
    // Basic validation
    if (!name || !email) {
        return res.status(400).json({ 
            error: 'Name and email are required',
            received: req.body
        });
    }
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
    }
    
    const newUser = {
        id: nextId++,
        name,
        email,
        age: age || 0,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    res.status(201).json({
        message: 'User created successfully',
        user: newUser
    });
});

// PUT - Update entire user (replace)
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const { name, email, age } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    
    // Check email conflict with other users
    const emailConflict = users.find(u => u.email === email && u.id !== userId);
    if (emailConflict) {
        return res.status(409).json({ error: 'Email already exists' });
    }
    
    users[userIndex] = {
        id: userId,
        name,
        email,
        age: age || 0,
        createdAt: users[userIndex].createdAt,
        updatedAt: new Date().toISOString()
    };
    
    res.json({
        message: 'User updated successfully',
        user: users[userIndex]
    });
});

// PATCH - Partial update
app.patch('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const updates = req.body;
    
    // Check email conflict if email is being updated
    if (updates.email) {
        const emailConflict = users.find(u => u.email === updates.email && u.id !== userId);
        if (emailConflict) {
            return res.status(409).json({ error: 'Email already exists' });
        }
    }
    
    users[userIndex] = {
        ...users[userIndex],
        ...updates,
        id: userId, // Ensure ID cannot be changed
        updatedAt: new Date().toISOString()
    };
    
    res.json({
        message: 'User updated successfully',
        user: users[userIndex],
        updatedFields: Object.keys(updates)
    });
});

// DELETE - Remove user
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.json({
        message: 'User deleted successfully',
        user: deletedUser,
        remainingUsers: users.length
    });
});

// HEAD - Check if user exists (returns headers only)
app.head('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (user) {
        res.set('X-User-Exists', 'true');
        res.set('X-User-Name', user.name);
        res.status(200).end();
    } else {
        res.status(404).end();
    }
});

// OPTIONS - Return allowed methods
app.options('/users', (req, res) => {
    res.set('Allow', 'GET, POST, OPTIONS');
    res.json({
        allowedMethods: ['GET', 'POST', 'OPTIONS'],
        endpoints: {
            'GET /users': 'Get all users',
            'POST /users': 'Create new user'
        }
    });
});

app.options('/users/:id', (req, res) => {
    res.set('Allow', 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS');
    res.json({
        allowedMethods: ['GET', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
        endpoints: {
            'GET /users/:id': 'Get specific user',
            'PUT /users/:id': 'Update entire user',
            'PATCH /users/:id': 'Partial update user',
            'DELETE /users/:id': 'Delete user',
            'HEAD /users/:id': 'Check if user exists'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('- GET    /users (get all users)');
    console.log('- GET    /users/:id (get specific user)');
    console.log('- POST   /users (create user)');
    console.log('- PUT    /users/:id (update entire user)');
    console.log('- PATCH  /users/:id (partial update)');
    console.log('- DELETE /users/:id (delete user)');
    console.log('- HEAD   /users/:id (check if exists)');
    console.log('- OPTIONS /users (get allowed methods)');
    console.log('\nTest data available: users with IDs 1 and 2');
});