const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProductById,
  getProducts,
  getMyproducts,
  deleteProduct,
  getProductsByOwner,
  getProductsByCategory,
  updateProduct,
} = require("../controllers/productController");
const protect = require("../middlewares/authMiddleware");

router.post("/", protect, addProduct);

router.get("/my-products", protect, getMyproducts);

router.get("/:id", getProductById);

router.get("/", getProducts);


router.get("/owner/:id", getProductsByOwner);

router.get("/category/:category", getProductsByCategory);

router.delete("/:id", protect, deleteProduct);

router.put("/:id", protect, updateProduct);

module.exports = router;
