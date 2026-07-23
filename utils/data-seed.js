const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Category = require('../models/Category.models');
const Product = require('../models/Product.models');

dotenv.config();

const startConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' Database connected for seeding...');
    } catch (error) {
        console.error(` DB Error: ${error.message}`);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        await startConnection();

        await Category.deleteMany();
        await Product.deleteMany();
        console.log(' Database cleared!');

        const categories = await Category.insertMany([
            { name: 'Electronics', description: 'Smartphones, laptops, and smart gadgets' },
            { name: 'Gaming', description: 'Consoles, controllers, and video games' },
            { name: 'football', description: 'ball, football-shoes, T-shirt, gloves, water-bottle'}
        ]);

        console.log(' Categories created successfully!');

        await Product.insertMany([
            { name: 'iPhone 15 Pro', price: 899, description: 'Latest iPhone with advanced features', category: categories[0]._id, stock: 12 },
            { name: 'MacBook Air M2', price: 1599, description: 'Lightweight and powerful laptop', category: categories[0]._id, stock: 9 },
            { name: 'Samsung S25 Ultra', price: 699, description: 'Latest Samsung smartphone', category: categories[0]._id, stock: 15 },
            { name: 'iphone 17', price: 999, description: 'Latest iPhone', category: categories[0]._id, stock: 0 },
            { name: 'iphone 17 pro max', price: 1199, description: 'Latest iPhone Pro Max', category: categories[0]._id, stock: 7 },
            { name: 'apple watch series 11', price: 799, description: 'Latest Apple Watch', category: categories[0]._id, stock: 6 },
            { name: 'PlayStation 5', price: 499, description: 'Latest PlayStation 5', category: categories[1]._id, stock: 0 },
            { name: 'Xbox Series X', price: 599, description: 'Latest Xbox Series X', category: categories[1]._id, stock: 11 },
            { name: 'PS5 controller', price: 199, description: 'Latest PS5 controller', category: categories[1]._id, stock: 18 },
            { name: 'Xbox controller', price: 299, description: 'Latest Xbox controller', category: categories[1]._id, stock: 14 },
            { name: 'PS4 controller', price: 99, description: 'Latest PS4 controller', category: categories[1]._id, stock: 0 },
            { name: 'Spider-man2', price: 89, description: 'Latest Spider-man 2 game', category: categories[1]._id, stock: 22 },
            { name: 'F50 Elite(FG) Football Boots', price: 699, description: 'Latest F50 Elite(FG) Football Boots', category: categories[2]._id, stock: 8 },
            { name: 'PREDATOR ELITE Fold-Over Tongue(FG) Football Boots', price: 599, description: 'Latest PREDATOR ELITE Fold-Over Tongue(FG) Football Boots', category: categories[2]._id, stock: 10 },
            { name: 'Nike Mercurial Superfly 11 Elite SE', price: 499, description: 'Latest Nike Mercurial Superfly 11 Elite SE', category: categories[2]._id, stock: 4 },
            { name: 'Nike Mercurial Vapor 17 Elite', price: 399, description: 'Latest Nike Mercurial Vapor 17 Elite', category: categories[2]._id, stock: 0 },
            { name: 'Nike Tiempo Ligera Pro', price: 299, description: 'Latest Nike Tiempo Ligera Pro', category: categories[2]._id, stock: 5 },
            { name: 'FUTURE 8 ULTIMATE FG Football Boots', price: 199, description: 'Latest FUTURE 8 ULTIMATE FG Football Boots', category: categories[2]._id, stock: 16 },
        ]);

        console.log(' Products loaded!');
        console.log(' Seeding completed!');
        process.exit();
    } catch (error) {
        console.error(`Error during seeding: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();