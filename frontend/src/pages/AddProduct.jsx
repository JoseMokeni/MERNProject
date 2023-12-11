import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    image: null,
    category: "",
    status: "available",
  });

  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    // add image file to the form data
    formData.append("image", product.image);
    formData.append("category", product.category);
    formData.append("status", product.status);

    try {
      const trimmedToken = user.replace(/['"]+/g, "");
      const bearerToken = `Bearer ${trimmedToken}`;
      const response = await axios.post(
        "https://marketplace-crud.onrender.com/api/products",
        formData,
        {
          headers: {
            Authorization: bearerToken,
          },
        }
      );
      const { data } = response;
      toast.success("Product added successfully");
      navigate(`/products/${data.product._id}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!user) {
      toast.error("You need to login first");
      navigate("/login");
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://marketplace-crud.onrender.com/api/categories"
        );
        const { data } = response;
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div className="bannerAddProd w-full mt-8">
        <h1 className="text-4xl text-center font-bold">Update Product</h1>
      </div>

      <form className="w-[85%] lg:w-1/2 mx-auto mt-8" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Product name"
            className="bg-gray-100 border-2 w-full p-4 rounded-lg"
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="sr-only">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="4"
            placeholder="Description"
            className="bg-gray-100 border-2 w-full p-4 rounded-lg"
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="sr-only">
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            placeholder="Price"
            className="bg-gray-100 border-2 w-full p-4 rounded-lg"
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            pattern="[0-9]+"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="sr-only">
            Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            placeholder="Image"
            className="bg-gray-100 border-2 w-full p-4 rounded-lg"
            // on change set file to the state
            onChange={(e) =>
              setProduct({ ...product, image: e.target.files[0] })
            }
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="sr-only">
            Category
          </label>
          <select
            name="category_id"
            id="category"
            className="bg-gray-100 border-2 w-full p-4 rounded-lg"
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
            required
          >
            <option value="">Select a category</option>
            {/* Categories */}
            {/* The category of the product will be selected */}
            {categories.map((category) => {
              return <option value={category._id}>{category.name}</option>;
            })}
          </select>
        </div>

        {/* <div className="mb-4">
          <label htmlFor="status" className="sr-only">
            Category
          </label>
          <select
            name="status"
            id="status"
            className="bg-gray-100 border-2 w-full p-4 rounded-lg"
          >
            <option value="">Select the status of the product</option>
            <option
              value="sold"
              onChange={(e) =>
                setProduct({ ...product, status: e.target.value })
              }
            >
              Sold
            </option>
            <option
              value="available"
              onChange={(e) =>
                setProduct({ ...product, status: e.target.value })
              }
            >
              Available
            </option>
          </select>
        </div> */}

        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-3 rounded font-medium w-full"
          >
            Add Product
          </button>
        </div>
      </form>
    </>
  );
};

export default AddProduct;
