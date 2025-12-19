// Exercise 5: Query Parameters - Search, Filter, Pagination
//
// TASK: Create advanced query parameter handling with the following requirements:
//
// 1. Create sample data arrays:
//    - Products: id, name, category, price, brand, inStock, rating, tags[]
//    - Users: id, name, email, age, city, country, joinDate
//    - Include at least 8-10 items in each array
//
// 2. Implement GET /products with these query parameters:
//    - search: text search in name and tags
//    - category: filter by category
//    - brand: filter by brand (support multiple brands)
//    - minPrice, maxPrice: price range filtering
//    - inStock: filter by availability (true/false)
//    - minRating: filter by minimum rating
//    - tags: filter by tags (support multiple)
//    - sortBy: sort by price, rating, name (asc/desc)
//    - page, limit: pagination support
//
// 3. Implement GET /users with these query parameters:
//    - search: search in name and email
//    - minAge, maxAge: age range filtering
//    - country: filter by country
//    - city: filter by city
//    - joinedAfter, joinedBefore: date range filtering
//    - sortBy: sort by age, joinDate, name
//    - page, limit: pagination
//
// 4. Advanced features:
//    - Support comma-separated values for multi-value parameters
//    - Case-insensitive text searching
//    - Proper pagination with metadata (totalPages, currentPage, etc.)
//    - Default sorting and pagination values
//    - Query parameter validation and sanitization
//
// 5. Create GET /search/suggestions endpoint:
//    - Return available filter values (categories, brands, countries, etc.)
//    - Help users understand what values they can filter by
//
// HINTS:
// - Use req.query to access query parameters
// - Array.isArray() to check if parameter is an array
// - String.toLowerCase() for case-insensitive search
// - Array filter(), sort(), slice() for data manipulation
// - Use Date objects for date comparisons
// - Math.ceil() for calculating total pages

import express from 'express';

const app = express();
const PORT = 3004;

// TODO: Create sample products array with all required fields

// TODO: Create sample users array with all required fields

// TODO: Implement GET /products with comprehensive filtering

// TODO: Implement GET /users with comprehensive filtering

// TODO: Implement GET /search/suggestions

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Test these query combinations:');
    console.log('Products:');
    console.log('- /products?search=phone');
    console.log('- /products?category=electronics&minPrice=500');
    console.log('- /products?brand=Apple,Samsung&inStock=true');
    console.log('- /products?sortBy=price&order=desc&page=1&limit=5');
    console.log('Users:');
    console.log('- /users?country=USA&minAge=25');
    console.log('- /users?search=john&sortBy=age');
    console.log('- /users?joinedAfter=2023-01-01&city=New York');
    console.log('Other:');
    console.log('- /search/suggestions');
});