const Product = require('../models/Product.models');
const Category = require('../models/Category.models');
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
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|ne|nin|eq)\b/g, match => `$${match}`);

    let queryObj = JSON.parse(queryStr);

    if (queryObj.inStock !== undefined) {
        const inStock = queryObj.inStock === true || queryObj.inStock === 'true';
        queryObj.stock = inStock ? { $gt: 0 } : { $eq: 0 };
        delete queryObj.inStock;
    }

    if (queryObj.name) {
        queryObj.name = { $regex: queryObj.name, $options: 'i' };
    }

    if (queryObj.description) {
        queryObj.description = { $regex: queryObj.description, $options: 'i' };
    }

    let query = Product.find(queryObj).populate('category', 'name description');

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 0;
    const startIndex = (page - 1) * limit;
    const total = await Product.countDocuments(queryObj);

    if (limit > 0) {
        query = query.skip(startIndex).limit(limit);
    }

    const products = await query;

    res.status(200).json({
        success: true,
        count: products.length,
        pagination: limit > 0 ? {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        } : null,
        data: products
    });
});
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category','name description');
    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.status(200).json({ status:'success',message:'operation completed successfully', data: product});
});