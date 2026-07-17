import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        'paid',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'paid',
    },

    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String,
    },

    payment: {
      razorpayOrderId: {
        type: String,
        required: true,
        unique: true,
      },

      razorpayPaymentId: {
        type: String,
        required: true,
        unique: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Order', orderSchema);