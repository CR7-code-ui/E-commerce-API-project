const Cart = require('../models/Cart');
const Product = require('../models/Product.models');
const asyncHandler = require('../middleware/asyncHandler');

const calculateTotalPrice = (cart) => {
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.quantity * item.price), 0);
};

exports.addToCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: 'default_user' }); 
    if (!cart) {
        cart = new Cart({ userId: 'default_user' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity || 1);
    } else {
        cart.items.push({
            product: productId,
            quantity: Number(quantity || 1),
            price: product.price
        });
    }

    calculateTotalPrice(cart);
    await cart.save();

    res.status(200).json({ success: true, data: cart });
});

exports.updateCartItem = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: 'default_user' });

    if (!cart) {
        return res.status(404).json({ success: false, error: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
        return res.status(404).json({ success: false, error: 'Item not found in cart' });
    }

    if (Number(quantity) <= 0) {
        item.remove();
    } else {
        item.quantity = Number(quantity);
    }

    calculateTotalPrice(cart);
    await cart.save();

    res.status(200).json({ success: true, data: cart });
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ userId: 'default_user' });

    if (!cart) {
        return res.status(404).json({ success: false, error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);

    calculateTotalPrice(cart);
    await cart.save();

    res.status(200).json({ success: true, data: cart });
});

exports.getCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ userId: 'default_user' }).populate('items.product');
    
    if (!cart) {
        return res.status(200).json({ success: true, data: { items: [], totalPrice: 0 } });
    }

    res.status(200).json({ success: true, data: cart });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ userId: 'default_user' });

    if (cart) {
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
    }

    res.status(200).json({ success: true, data: {} });
});