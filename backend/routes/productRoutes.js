const express = require('express')
const router = express.Router()

const { addProduct, getProductById, getProducts, getMyproducts, deleteProduct, getProductsByOwner, getProductsByCategory } = require('../controllers/productController')

router.post('/', addProduct)

router.get('/:id', getProductById)

router.get('/', getProducts)

router.get('/my-products', getMyproducts)

router.get('/owner/:id', getProductsByOwner)

router.get('/category/:category', getProductsByCategory)

router.delete('/', deleteProduct)



module.exports = router