const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

router.post("/", registerUser);

router.get("/", protect, getUsers);

router.post("/login", loginUser);

router.get("/:id", protect, getUser);
// TODO

router.delete("/:id", protect, deleteUser);

router.put("/:id", protect, updateUser);

module.exports = router;
