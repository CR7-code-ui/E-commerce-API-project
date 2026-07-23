const Order = require('../models/order');
const Cart = require('../models/Cart');
const Product = require('../models/Product.models');
const asyncHandler = require('../middleware/asyncHandler');

exports.createOrder = asyncHandler(async (req, res, next) => {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ userId: 'default_user' });
    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, error: 'Your cart is empty' });
    }

    for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (!product) {
            return res.status(44);
        }
        if (product.stock !== undefined && product.stock < item.quantity) {
            return res.status(400).json({ success: false, error: `Not enough stock for ${product.name}` });
        }
        if (product.stock !== undefined) {
            product.stock -= item.quantity;
            await product.save();
        }
    }

    const order = await Order.create({
        userId: 'default_user',
        items: cart.items,
        totalPrice: cart.totalPrice,
        shippingAddress
    });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({ success: true, data: order });
});

exports.getOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ userId: 'default_user' }).populate('items.product');
    res.status(200).json({ success: true, count: orders.length, data: orders });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, data: order });
});