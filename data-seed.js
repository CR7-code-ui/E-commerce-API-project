const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Category = require('./models/Category');
const Product = require('./models/Product');

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
            { name: 'iPhone 15 Pro', price: 899, category: categories[0]._id, inStock: true },
            { name: 'MacBook Air M2', price: 1599, category: categories[0]._id, inStock: true },
            { name: 'Samsung S25 Ultra', price: 699, category: categories[0]._id, inStock: true },
            { name: 'iphone 17', price: 999, category: categories[0]._id, inStock: false },
            { name: 'iphone 17 pro max', price: 1199, category: categories[0]._id, inStock: true },
            { name: 'apple watch series 11', price: 799, category: categories[0]._id, inStock: true },
            { name: 'PlayStation 5', price: 499, category: categories[1]._id, inStock: false },
            { name: 'Xbox Series X', price: 599, category: categories[1]._id, inStock: true },
            { name: 'PS5 controller', price: 199, category: categories[1]._id, inStock: true },
            { name: 'Xbox controller', price: 299, category: categories[1]._id, inStock: true },
            { name: 'PS4 controller', price: 99, category: categories[1]._id, inStock: false },
            { name: 'Spider-man2', price: 89, category: categories[1]._id, inStock: true },
            { name: 'F50 Elite(FG) Football Boots', price: 699, category: categories[2]._id, inStock: true },
            { name: 'PREDATOR ELITE Fold-Over Tongue(FG) Football Boots', price: 599, category: categories[2]._id, inStock: true },
            { name: 'Nike Mercurial Superfly 11 Elite SE', price: 499, category: categories[2]._id, inStock: true },
            { name: 'Nike Mercurial Vapor 17 Elite', price: 399, category: categories[2]._id, inStock: false },
            { name: 'Nike Tiempo Ligera Pro', price: 299, category: categories[2]._id, inStock: true },
            { name: 'FUTURE 8 ULTIMATE FG Football Boots', price: 199, category: categories[2]._id, inStock: true },
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