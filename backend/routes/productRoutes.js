const express = require('express')
const router = express.Router()

const { addProduct, getProductById, getProducts, getProductsByOwner } = require('../controllers/productController')

router.post('/', addProduct)

router.get('/details', getProductById)

router.get('/', getProducts)

router.get('/my-products', getProductsByOwner)



module.exports = router