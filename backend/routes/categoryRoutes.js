const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    console.log(req.params.id);
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  })
);

module.exports = router;
