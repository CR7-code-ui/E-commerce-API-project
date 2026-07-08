const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');

exports.createProduct = asyncHandler(async (req, res, next) => {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
        return res.status(404).json({ success: false, error: 'Category not found. Cannot create product.' });
    }

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
    if (req.body.category) {
        const categoryExists = await Category.findById(req.body.category);
        if (!categoryExists) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: {} });
});

exports.getProducts = asyncHandler(async (req, res, next) => {
    let query;
    
    const reqQuery = { ...req.query };

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => '$${match}');

    query = Product.find(JSON.parse(queryStr));

    const products = await query;

    res.status(200).json({ success: true, count: products.length, data: products });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
});