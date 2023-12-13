import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const EditProduct = () => {
  const { user } = useSelector((state) => state.auth);

  const [categories, setCategories] = useState([]);

  // get the product id from the URL
  const { id } = useParams();

  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    imageFile: null,
    category: "",
    owner: "",
    status: "",
    categoryId: "",
  });

  useEffect(() => {
    if (!user) {
      toast.error("You need to login first");
      navigate("/login");
    }

    const fetchProductData = async () => {
      try {
        let response = await axios.get(`/api/products/${id}`);
        let { data } = response;
        // console.log(data);
        let { name, description, price, image, category, owner, status } = data;
        setProduct({
          ...product,
          name,
          description,
          price,
          image,
          category,
          owner,
          status,
        });
        // console.log(product);
        response = await axios.get(`/api/categories/${category}`);
        // console.log(response);
        data = response.data;
        const { name: categoryName } = data;
        // console.log(categoryName);
        // setProduct({ ...product, category: categoryName });

        response = await axios.get(`/api/users/${owner}`);
        data = response.data;
        // console.log(data);
        const { phone: ownerPhone } = data;
        // console.log(ownerPhone);
        // setProduct({ ...product, owner: ownerName, category: categoryName });
        setProduct({
          ...product,
          name,
          description,
          price,
          image,
          category: categoryName,
          owner,
          ownerPhone: ownerPhone,
          status,
        });
      } catch (err) {
        console.log(err);
        toast.error(err.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        const { data } = response;
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductData();
    fetchCategories();
    console.log(product);
    console.log(categories);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    // add image file to the form data
    // if the user didn't change the image, don't append it to the form data
    if (product.imageFile) {
      formData.append("image", product.imageFile);
    }

    formData.append("category", product.categoryId);
    formData.append("status", product.status);

    try {
      const trimmedToken = user.replace(/['"]+/g, "");
      const bearerToken = `Bearer ${trimmedToken}`;
      const response = await axios.put(`/api/products/${id}`, formData, {
        headers: {
          Authorization: bearerToken,
        },
      });
      const { data } = response;
      toast.success("Product updated successfully");
      navigate(`/products/${id}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="bannerAddProd w-full mt-8">
        <h1 className="text-4xl text-center font-bold">Update Product</h1>
      </div>

      <form className="w-[85%] lg:w-1/2 mx-auto mt-8" onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={id} />
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
            value={product.name}
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
            value={product.description}
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
            value={product.price}
            pattern="[0-9]+"
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
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
            onChange={(e) =>
              setProduct({ ...product, imageFile: e.target.files[0] })
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
              setProduct({ ...product, categoryId: e.target.value })
            }
          >
            <option value="">Select a category</option>
            {/* Categories */}
            {/* The category of the product will be selected */}
            {categories.map((category) => {
              if (category.name == product.category) {
                return (
                  <option value={category._id} selected>
                    {category.name}
                  </option>
                );
              }
              return <option value={category._id}>{category.name}</option>;
            })}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="sr-only">
            Category
          </label>
          <select
            name="status"
            id="status"
            className="bg-gray-100 border-2 w-full p-4 rounded-lg"
            onChange={(e) => setProduct({ ...product, status: e.target.value })}
          >
            <option value="">Select the status of the product</option>
            {product.status == "available" ? (
              <>
                <option value="available" selected>
                  Available
                </option>
                <option value="sold">Sold</option>
              </>
            ) : (
              <>
                <option value="sold" selected>
                  Sold
                </option>
                <option value="available">Available</option>
              </>
            )}
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-3 rounded font-medium w-full"
          >
            Update Product
          </button>
        </div>
      </form>
    </>
  );
};

export default EditProduct;
