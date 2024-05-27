const Product = require("../models/Product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { findByIdAndUpdate } = require("../models/User");

// @desc: Add a new product
// @route: POST /api/products
// @access: Private

const addProduct = asyncHandler(async (req, res) => {
  // check if one of the fields is empty
  const fieldsEmpty =
    !req.body.name ||
    !req.body.price ||
    !req.body.description ||
    !req.files.image ||
    !req.body.category;

  console.log(req.body);
  console.log(req.files);

  if (fieldsEmpty) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  let { name, price, description, category } = req.body;

  const owner = req.user._id;

  // get the image file
  const image = req.files.image;

  // upload image to cloudinary
  const uploadedImage = await cloudinary.uploader.upload(image.tempFilePath);
  imageURL = uploadedImage.secure_url;

  const productToAdd = {
    name,
    price,
    description,
    image: imageURL,
    owner,
    category,
  };

  const product = await Product.create(productToAdd);

  if (product) {
    res.status(201);
    // remove temp file
    fs.unlinkSync(image.tempFilePath);

    res.json({
      message: "Product added successfully",
      product,
    });
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

// @desc: Get all products
// @route: GET /api/products
// @access: Public

const getProducts = asyncHandler(async (req, res) => {
  // check if a keyword is provided in the query as get parameter
  const keyword = req.query.keyword;
  let products;

  // if a keyword is provided
  if (keyword) {
    // search for products that contain the keyword in their name
    products = await Product.find({ name: { $regex: keyword, $options: "i" } });
  } else {
    products = await Product.find({});
  }

  if (products) {
    res.status(200);
    res.json(products);
  } else {
    res.status(404);
    throw new Error("No products found");
  }
});

// @desc: Get a product by id
// @route: GET /api/products/:id
// @access: Public

const getProductById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error("Please provide an id");
  }

  const product = await Product.findById(id);

  if (product) {
    res.status(200);
    res.json(product);
  } else {
    res.status(404);
    throw new Error("No product found");
  }
});

// @desc: Get products by category
// @route: GET /api/products/category/:category
// @access: Public

const getProductsByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category;
  if (!category) {
    res.status(400);
    throw new Error("Please provide a category");
  }

  const products = await Product.find({ category });

  if (products) {
    res.status(200);
    res.json(products);
  } else {
    res.status(404);
    throw new Error("No products found for this category");
  }
});

// @desc: Get my products
// @route: GET /api/products/my-products
// @access: Private

const getMyproducts = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  // console.log("owner: " + owner);

  // fetch the database
  const products = await Product.find({ owner });

  // console.log(owner);

  if (products) {
    res.status(200);
    res.json(products);
  } else {
    res.status(404);
    throw new Error("No products found");
  }
});

// @desc: Get products by owner
// @route: GET /api/products/owner/:id
// @access: Public

const getProductsByOwner = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error("Please provide an id");
  }

  // fetch the database
  const products = await Product.find({ owner: id });

  if (products) {
    res.status(200);
    res.json(products);
  } else {
    res.status(404);
    throw new Error("No products found");
  }
});

// @desc: Delete a product
// @route: DELETE /api/products/:id
// @access: Private

const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  console.log("id: " + id);

  if (!id) {
    res.status(400);
    throw new Error("Please provide an id");
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("No product found");
  }

  if (req.user._id != product.owner.toString() && req.user.role !== "admin") {
    res.status(401);
    throw new Error("Invalid token");
  }

  // delete the product
  const removedProduct = await Product.findByIdAndDelete(id);
  if (removedProduct) {
    res.status(200);

    // delete the image from cloudinary
    const image = removedProduct.image;
    const imageId = image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(imageId);

    res.json({
      message: "Product deleted successfully",
    });
  } else {
    res.status(404);
    throw new Error("An error occured while deleting the product");
  }
});

// @desc: Update product
// @route: PUT /api/products/:id
// @access: PRIVATE

const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("Please provide an id");
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("No product found with this id");
  }
  // console.log("product: " + product);
  // console.log("req.user._id: " + req.user._id);
  // console.log(req.user._id != product.owner.toString());

  if (req.user._id != product.owner.toString() && req.user.role !== "admin") {
    res.status(401);
    throw new Error("Invalid token");
  }

  const newData = {
    name: req.body.name || product.name,
    price: req.body.price || product.price,
    description: req.body.description || product.description,
    category: req.body.category || product.category,
    status: req.body.status || product.status,
  };
  // console.log(newData);

  // console.log(req.files.image);

  let image;

  // image
  if (req.files) {
    console.log("inside if");
    image = req.files.image;
    const uploadedImage = await cloudinary.uploader.upload(image.tempFilePath);
    imageURL = uploadedImage.secure_url;
    newData.image = imageURL;
  } else {
    newData.image = product.image;
  }

  // update the product
  product.name = newData.name;
  product.price = newData.price;
  product.description = newData.description;
  product.category = newData.category;
  product.image = newData.image;
  product.status = newData.status;

  console.log(newData);

  // const updatedProduct = await product.save();

  const updatedProduct = await Product.findOneAndUpdate({ _id: id }, newData);

  if (updatedProduct) {
    res.status(200);
    // remove temp file
    if (req.files) {
      fs.unlinkSync(image.tempFilePath);
    }
    res.json({
      message: "Product updated successfully",
    });
  } else {
    res.status(404);
    throw new Error("An error occured while updating the product");
  }
});

const tokenSended = (req) => {
  // verify if the token is present in the headers
  const authorization = req.headers.authorization;
  if (!authorization) {
    return false;
  }

  return true;
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  getMyproducts,
  deleteProduct,
  getProductsByOwner,
  getProductsByCategory,
  updateProduct,
};
