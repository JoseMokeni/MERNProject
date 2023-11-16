const Product = require('../models/Product');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const cloudinary = require('cloudinary').v2

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
        res.json({
            message: 'Product added successfully'
        })
    } else {
        res.status(400)
        throw new Error('Invalid product data')
    }

})



module.exports = {
    addProduct
}