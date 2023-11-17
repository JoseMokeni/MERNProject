const Product = require('../models/Product');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const cloudinary = require('cloudinary').v2
const fs = require('fs');


// @desc: Add a new product
// @route: POST /api/products
// @access: Private

const addProduct = asyncHandler(async (req, res) => {
    // check if one of the fields is empty
    const fieldsEmpty = !req.body.name || !req.body.price || !req.body.description || !req.files.image

    if (fieldsEmpty) {
        res.status(400)
        throw new Error('Please fill all the fields')
    }

    let {
        name,
        price,
        description
    } = req.body
    
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded) {
        res.status(401)
        throw new Error('Invalid token')
    }

    const owner = decoded._id

    // get the image file   
    const image = req.files.image
    
    // upload image to cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image.tempFilePath)
    imageURL = uploadedImage.secure_url

    const productToAdd = {
        name,
        price,
        description,
        image: imageURL,
        owner
    }

    const product = await Product.create(productToAdd)

    if (product) {
        res.status(201)
        // remove temp file
        fs.unlinkSync(image.tempFilePath);

        res.json({
            message: 'Product added successfully'
        })
    } else {
        res.status(400)
        throw new Error('Invalid product data')
    }

})

// @desc: Get all products
// @route: GET /api/products
// @access: Public

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({})

    if (products) {
        res.status(200)
        res.json(products)
    } else {
        res.status(404)
        throw new Error('No products found')
    }
})

// @desc: Get a product by id
// @route: GET /api/products/details
// @access: Public

const getProductById = asyncHandler(async (req, res) => {
    const id = req.query.id
    if (!id) {
        res.status(400)
        throw new Error('Please provide an id')
    }

    const product = await Product.findById(id)

    if (product) {
        res.status(200)
        res.json(product)
    } else {
        res.status(404)
        throw new Error('No product found')
    }
})

// @desc: Get products by owner
// @route: GET /api/products/my-products
// @access: Private

const getProductsByOwner = asyncHandler(async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded) {
        res.status(401)
        throw new Error('Invalid token')
    }

    const owner = decoded._id

    // fetch the database
    const products = await Product.find({owner})
    
    if (products) {
        res.status(200)
        res.json(products)
    } else {
        res.status(404)
        throw new Error('No products found')
    }

})



module.exports = {
    addProduct,
    getProducts,
    getProductById,
    getProductsByOwner
}