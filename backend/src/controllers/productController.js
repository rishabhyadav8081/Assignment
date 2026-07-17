import cloudinary from '../config/cloudinary.js';

import Product from '../models/Product.js';

import asyncHandler from '../utils/asyncHandler.js';

const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'cartnest/products',
          resource_type: 'image',
        },
        (error, result) =>
          error
            ? reject(error)
            : resolve(result)
      )
      .end(file.buffer);
  });

export const listProducts = asyncHandler(
  async (req, res) => {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      owner,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (keyword) {
      query.$or = ['name', 'description'].map(
        (field) => ({
          [field]: {
            $regex: keyword,
            $options: 'i',
          },
        })
      );
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {
        ...(minPrice && {
          $gte: Number(minPrice),
        }),
        ...(maxPrice && {
          $lte: Number(maxPrice),
        }),
      };
    }

    if (owner) {
      query.owner = owner;
    }

    const count =
      await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate('owner', 'name')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(count / limit),
      count,
    });
  }
);

export const categories = asyncHandler(
  async (_, res) => {
    res.json(
      await Product.distinct('category')
    );
  }
);

export const getProduct = asyncHandler(
  async (req, res) => {
    const product = await Product.findById(
      req.params.id
    ).populate('owner', 'name');

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    res.json(product);
  }
);

export const createProduct = asyncHandler(
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: 'Product image is required',
      });
    }

    const uploaded = await uploadImage(req.file);

    const product = await Product.create({
      ...req.body,
      image: uploaded.secure_url,
      imagePublicId: uploaded.public_id,
      owner: req.user._id,
    });

    res.status(201).json(product);
  }
);

const editableProduct = async (req, res) => {
  const product = await Product.findById(
    req.params.id
  );

  if (!product) {
    res.status(404).json({
      message: 'Product not found',
    });

    return null;
  }

  if (
    req.user.role !== 'admin' &&
    product.owner.toString() !==
      req.user._id.toString()
  ) {
    res.status(403).json({
      message:
        'You can only manage your own products',
    });

    return null;
  }

  return product;
};

export const updateProduct = asyncHandler(
  async (req, res) => {
    const product = await editableProduct(
      req,
      res
    );

    if (!product) return;

    for (const key of [
      'name',
      'description',
      'price',
      'category',
      'stock',
    ]) {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key];
      }
    }

    if (req.file) {
      const uploaded = await uploadImage(
        req.file
      );

      await cloudinary.uploader.destroy(
        product.imagePublicId
      );

      product.image = uploaded.secure_url;
      product.imagePublicId =
        uploaded.public_id;
    }

    await product.save();

    res.json(product);
  }
);

export const deleteProduct = asyncHandler(
  async (req, res) => {
    const product = await editableProduct(
      req,
      res
    );

    if (!product) return;

    await cloudinary.uploader.destroy(
      product.imagePublicId
    );

    await product.deleteOne();

    res.json({
      message: 'Product deleted',
    });
  }
);