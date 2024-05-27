const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { errorHandler } = require("./middlewares/errorMiddleware");
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
const expressFileUpload = require("express-fileupload");
const createCategories = require("./utils/createCategories");

// console.log(process.env);

const { MONGO_HOST, MONGO_USER, MONGO_PASSWORD, MONGO_DB, MONGO_PORT } =
  process.env;

console.log(MONGO_HOST, MONGO_USER, MONGO_PASSWORD, MONGO_DB, MONGO_PORT);

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

// cloudinary config

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(
  expressFileUpload({
    useTempFiles: true,
  })
);

// mongoose connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    createCategories();
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
