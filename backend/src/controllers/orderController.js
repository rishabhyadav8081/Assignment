import crypto from 'crypto';
import Razorpay from 'razorpay';

import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

import asyncHandler from '../utils/asyncHandler.js';

const razorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

export const createPaymentOrder = asyncHandler(
  async (req, res) => {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate('items.product');

    if (!cart?.items.length) {
      return res.status(400).json({
        message: 'Your cart is empty',
      });
    }

    if (
      cart.items.some(
        (item) =>
          !item.product ||
          item.quantity > item.product.stock
      )
    ) {
      return res.status(400).json({
        message: 'Some cart items are unavailable',
      });
    }

    const amount = cart.items.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    );

    const paymentOrder = await razorpay().orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `cart_${Date.now()}`,
    });

    res.json({
      id: paymentOrder.id,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  }
);

export const verifyPayment = asyncHandler(
  async (req, res) => {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
    } = req.body;

    const expected = crypto
      .createHmac(
        'sha256',
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest('hex');

    if (
      !razorpay_signature ||
      expected !== razorpay_signature
    ) {
      return res.status(400).json({
        message: 'Payment verification failed',
      });
    }

    const existing = await Order.findOne({
      'payment.razorpayOrderId':
        razorpay_order_id,
    });

    if (existing) {
      return res.json(existing);
    }

    const paymentOrder = await razorpay().orders.fetch(
      razorpay_order_id
    );

    if (paymentOrder.status !== 'paid') {
      return res.status(400).json({
        message: 'Payment is not marked as paid',
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate('items.product');

    if (!cart?.items.length) {
      return res.status(400).json({
        message: 'Cart is empty',
      });
    }

    const items = cart.items.map(
      ({ product, quantity }) => ({
        product: product._id,
        seller: product.owner,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      })
    );

    const totalAmount = items.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

    if (
      Math.round(totalAmount * 100) !==
      paymentOrder.amount
    ) {
      return res.status(400).json({
        message:
          'Payment amount does not match cart total',
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      payment: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    await Promise.all(
      items.map((item) =>
        Product.updateOne(
          {
            _id: item.product,
            stock: {
              $gte: item.quantity,
            },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          }
        )
      )
    );

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  }
);

export const myOrders = asyncHandler(
  async (req, res) => {
    res.json(
      await Order.find({
        user: req.user._id,
      }).sort('-createdAt')
    );
  }
);

export const sellerOrders = asyncHandler(
  async (req, res) => {
    res.json(
      await Order.find({
        'items.seller': req.user._id,
      })
        .populate('user', 'name email')
        .sort('-createdAt')
    );
  }
);

export const allOrders = asyncHandler(
  async (_, res) => {
    res.json(
      await Order.find()
        .populate('user', 'name email')
        .sort('-createdAt')
    );
  }
);

export const updateOrderStatus = asyncHandler(
  async (req, res) => {
    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    res.json(order);
  }
);

export const stats = asyncHandler(
  async (_, res) => {
    const [summary] = await Order.aggregate([
      {
        $match: {
          status: {
            $ne: 'cancelled',
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: '$totalAmount',
          },
          totalOrders: {
            $sum: 1,
          },
          averageOrder: {
            $avg: '$totalAmount',
          },
        },
      },
    ]);

    res.json(
      summary || {
        totalSales: 0,
        totalOrders: 0,
        averageOrder: 0,
      }
    );
  }
);