// Solution 5: Query Parameters - Search, Filter, Pagination
import express from 'express';

const app = express();
const PORT = 3004;

// Sample products data
const products = [
    { id: 1, name: 'iPhone 14', category: 'electronics', price: 999, brand: 'Apple', inStock: true, rating: 4.5, tags: ['phone', 'smartphone', 'ios'] },
    { id: 2, name: 'Samsung Galaxy S23', category: 'electronics', price: 899, brand: 'Samsung', inStock: true, rating: 4.3, tags: ['phone', 'smartphone', 'android'] },
    { id: 3, name: 'MacBook Pro', category: 'electronics', price: 1999, brand: 'Apple', inStock: false, rating: 4.8, tags: ['laptop', 'computer', 'macos'] },
    { id: 4, name: 'Cotton T-Shirt', category: 'clothing', price: 29, brand: 'Generic', inStock: true, rating: 4.0, tags: ['shirt', 'cotton', 'casual'] },
    { id: 5, name: 'Running Shoes', category: 'clothing', price: 129, brand: 'Nike', inStock: true, rating: 4.6, tags: ['shoes', 'running', 'sports'] },
    { id: 6, name: 'JavaScript Guide', category: 'books', price: 45, brand: 'TechBooks', inStock: true, rating: 4.7, tags: ['programming', 'javascript', 'guide'] },
    { id: 7, name: 'Cooking Essentials', category: 'books', price: 25, brand: 'CookPress', inStock: true, rating: 4.2, tags: ['cooking', 'recipes', 'food'] },
    { id: 8, name: 'Gaming Headset', category: 'electronics', price: 79, brand: 'SteelSeries', inStock: false, rating: 4.4, tags: ['headset', 'gaming', 'audio'] },
    { id: 9, name: 'Yoga Mat', category: 'sports', price: 35, brand: 'FitLife', inStock: true, rating: 4.1, tags: ['yoga', 'exercise', 'mat'] },
    { id: 10, name: 'Coffee Maker', category: 'home', price: 159, brand: 'BrewMaster', inStock: true, rating: 4.3, tags: ['coffee', 'appliance', 'kitchen'] }
];

// Sample users data
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, city: 'New York', country: 'USA', joinDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, city: 'London', country: 'UK', joinDate: '2023-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, city: 'Toronto', country: 'Canada', joinDate: '2023-03-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 28, city: 'Sydney', country: 'Australia', joinDate: '2023-01-05' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 42, city: 'Berlin', country: 'Germany', joinDate: '2023-04-12' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', age: 31, city: 'Paris', country: 'France', joinDate: '2023-02-28' },
    { id: 7, name: 'Ethan Hunt', email: 'ethan@example.com', age: 38, city: 'Tokyo', country: 'Japan', joinDate: '2023-03-15' },
    { id: 8, name: 'Fiona Green', email: 'fiona@example.com', age: 26, city: 'New York', country: 'USA', joinDate: '2023-01-22' }
];

// Helper function to parse comma-separated values
const parseMultiValue = (value) => {
    if (!value) return null;
    return Array.isArray(value) ? value : value.split(',').map(v => v.trim());
};

// Helper function for case-insensitive search
const searchInText = (text, searchTerm) => {
    return text.toLowerCase().includes(searchTerm.toLowerCase());
};

// Advanced product search with multiple filters
app.get('/products', (req, res) => {
    let filteredProducts = [...products];
    
    // Text search in name and tags
    if (req.query.search) {
        const searchTerm = req.query.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            searchInText(product.name, searchTerm) ||
            product.tags.some(tag => searchInText(tag, searchTerm))
        );
    }
    
    // Category filter
    if (req.query.category) {
        filteredProducts = filteredProducts.filter(p => p.category === req.query.category);
    }
    
    // Brand filter (can be multiple brands)
    if (req.query.brand) {
        const brands = parseMultiValue(req.query.brand);
        filteredProducts = filteredProducts.filter(p => brands.includes(p.brand));
    }
    
    // Price range filtering
    if (req.query.minPrice) {
        const minPrice = parseFloat(req.query.minPrice);
        if (!isNaN(minPrice)) {
            filteredProducts = filteredProducts.filter(p => p.price >= minPrice);
        }
    }
    
    if (req.query.maxPrice) {
        const maxPrice = parseFloat(req.query.maxPrice);
        if (!isNaN(maxPrice)) {
            filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
        }
    }
    
    // Stock availability
    if (req.query.inStock !== undefined) {
        const inStock = req.query.inStock === 'true';
        filteredProducts = filteredProducts.filter(p => p.inStock === inStock);
    }
    
    // Minimum rating filter
    if (req.query.minRating) {
        const minRating = parseFloat(req.query.minRating);
        if (!isNaN(minRating)) {
            filteredProducts = filteredProducts.filter(p => p.rating >= minRating);
        }
    }
    
    // Tags filter (can be multiple tags)
    if (req.query.tags) {
        const searchTags = parseMultiValue(req.query.tags);
        filteredProducts = filteredProducts.filter(p =>
            searchTags.some(tag => p.tags.some(productTag => 
                searchInText(productTag, tag)
            ))
        );
    }
    
    // Sorting
    if (req.query.sortBy) {
        const sortBy = req.query.sortBy;
        const order = req.query.order === 'desc' ? -1 : 1;
        
        filteredProducts.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];
            
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            if (aVal < bVal) return -1 * order;
            if (aVal > bVal) return 1 * order;
            return 0;
        });
    }
    
    // Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredProducts.length / limit);
    
    res.json({
        products: paginatedProducts,
        pagination: {
            currentPage: page,
            totalPages,
            totalResults: filteredProducts.length,
            hasNext: page < totalPages,
            hasPrev: page > 1,
            limit
        },
        filters: {
            search: req.query.search || null,
            category: req.query.category || null,
            brand: parseMultiValue(req.query.brand),
            priceRange: {
                min: req.query.minPrice || null,
                max: req.query.maxPrice || null
            },
            inStock: req.query.inStock || null,
            minRating: req.query.minRating || null,
            tags: parseMultiValue(req.query.tags)
        },
        sorting: {
            sortBy: req.query.sortBy || null,
            order: req.query.order || 'asc'
        }
    });
});

// Users search with comprehensive filtering
app.get('/users', (req, res) => {
    let filteredUsers = [...users];
    
    // Search in name and email
    if (req.query.search) {
        const searchTerm = req.query.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
            searchInText(user.name, searchTerm) ||
            searchInText(user.email, searchTerm)
        );
    }
    
    // Age range filtering
    if (req.query.minAge) {
        const minAge = parseInt(req.query.minAge);
        if (!isNaN(minAge)) {
            filteredUsers = filteredUsers.filter(u => u.age >= minAge);
        }
    }
    
    if (req.query.maxAge) {
        const maxAge = parseInt(req.query.maxAge);
        if (!isNaN(maxAge)) {
            filteredUsers = filteredUsers.filter(u => u.age <= maxAge);
        }
    }
    
    // Country filter
    if (req.query.country) {
        filteredUsers = filteredUsers.filter(u => 
            u.country.toLowerCase() === req.query.country.toLowerCase()
        );
    }
    
    // City filter
    if (req.query.city) {
        filteredUsers = filteredUsers.filter(u =>
            searchInText(u.city, req.query.city)
        );
    }
    
    // Date range filtering
    if (req.query.joinedAfter) {
        const afterDate = new Date(req.query.joinedAfter);
        if (!isNaN(afterDate.getTime())) {
            filteredUsers = filteredUsers.filter(u => 
                new Date(u.joinDate) >= afterDate
            );
        }
    }
    
    if (req.query.joinedBefore) {
        const beforeDate = new Date(req.query.joinedBefore);
        if (!isNaN(beforeDate.getTime())) {
            filteredUsers = filteredUsers.filter(u => 
                new Date(u.joinDate) <= beforeDate
            );
        }
    }
    
    // Sorting
    if (req.query.sortBy) {
        const sortBy = req.query.sortBy;
        const order = req.query.order === 'desc' ? -1 : 1;
        
        filteredUsers.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];
            
            // Handle date sorting
            if (sortBy === 'joinDate') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            } else if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            if (aVal < bVal) return -1 * order;
            if (aVal > bVal) return 1 * order;
            return 0;
        });
    }
    
    // Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredUsers.length / limit);
    
    res.json({
        users: paginatedUsers,
        pagination: {
            currentPage: page,
            totalPages,
            totalResults: filteredUsers.length,
            hasNext: page < totalPages,
            hasPrev: page > 1,
            limit
        },
        filters: {
            search: req.query.search || null,
            ageRange: {
                min: req.query.minAge || null,
                max: req.query.maxAge || null
            },
            country: req.query.country || null,
            city: req.query.city || null,
            dateRange: {
                after: req.query.joinedAfter || null,
                before: req.query.joinedBefore || null
            }
        },
        sorting: {
            sortBy: req.query.sortBy || null,
            order: req.query.order || 'asc'
        }
    });
});

// Search suggestions endpoint
app.get('/search/suggestions', (req, res) => {
    // Extract unique values for filter suggestions
    const categories = [...new Set(products.map(p => p.category))].sort();
    const brands = [...new Set(products.map(p => p.brand))].sort();
    const countries = [...new Set(users.map(u => u.country))].sort();
    const cities = [...new Set(users.map(u => u.city))].sort();
    const allTags = [...new Set(products.flatMap(p => p.tags))].sort();
    
    const priceRange = {
        min: Math.min(...products.map(p => p.price)),
        max: Math.max(...products.map(p => p.price))
    };
    
    const ageRange = {
        min: Math.min(...users.map(u => u.age)),
        max: Math.max(...users.map(u => u.age))
    };
    
    res.json({
        products: {
            categories,
            brands,
            tags: allTags,
            priceRange,
            ratingRange: { min: 0, max: 5 },
            sortOptions: ['name', 'price', 'rating', 'brand']
        },
        users: {
            countries,
            cities,
            ageRange,
            sortOptions: ['name', 'age', 'joinDate', 'city', 'country']
        },
        queryParameters: {
            products: {
                search: 'Text search in name and tags',
                category: 'Filter by category',
                brand: 'Filter by brand (comma-separated)',
                minPrice: 'Minimum price',
                maxPrice: 'Maximum price',
                inStock: 'Filter by availability (true/false)',
                minRating: 'Minimum rating',
                tags: 'Filter by tags (comma-separated)',
                sortBy: 'Sort field',
                order: 'Sort order (asc/desc)',
                page: 'Page number',
                limit: 'Results per page'
            },
            users: {
                search: 'Text search in name and email',
                minAge: 'Minimum age',
                maxAge: 'Maximum age',
                country: 'Filter by country',
                city: 'Filter by city',
                joinedAfter: 'Joined after date (YYYY-MM-DD)',
                joinedBefore: 'Joined before date (YYYY-MM-DD)',
                sortBy: 'Sort field',
                order: 'Sort order (asc/desc)',
                page: 'Page number',
                limit: 'Results per page'
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Test these query combinations:');
    console.log('\nProducts:');
    console.log('- /products?search=phone');
    console.log('- /products?category=electronics&minPrice=500');
    console.log('- /products?brand=Apple,Samsung&inStock=true');
    console.log('- /products?tags=smartphone,laptop&sortBy=price&order=desc');
    console.log('- /products?minRating=4.0&page=1&limit=5');
    console.log('\nUsers:');
    console.log('- /users?country=USA&minAge=25');
    console.log('- /users?search=john&sortBy=age&order=desc');
    console.log('- /users?joinedAfter=2023-02-01&city=New York');
    console.log('- /users?maxAge=30&sortBy=joinDate&page=1&limit=3');
    console.log('\nOther:');
    console.log('- /search/suggestions');
});