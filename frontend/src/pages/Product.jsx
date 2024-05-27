import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";

// get API ENDPOINT from .env file

const API_ENDPOINT = process.env.REACT_APP_API_HOST;
const API_PORT = process.env.REACT_APP_API_PORT;

const API_URL = `${API_ENDPOINT}:${API_PORT}/api`;

const Product = () => {
  const { user } = useSelector((state) => state.auth);

  // get the product id from the URL
  const { id } = useParams();

  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
    owner: "",
    status: "",
  });

  const fetchProductData = async () => {
    try {
      let response = await axios.get(`${API_URL}/products/${id}`);
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
      response = await axios.get(`${API_URL}/categories/${category}`);
      // console.log(response);
      data = response.data;
      const { name: categoryName } = data;
      // console.log(categoryName);
      // setProduct({ ...product, category: categoryName });

      response = await axios.get(`${API_URL}/users/${owner}`);
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

  const getCategory = async () => {
    try {
      // console.log(product.category);
      const response = await axios.get(
        `${API_URL}/categories/${product.category}`
      );
      const { data } = response;
      const { name } = data;
      setProduct({ ...product, category: name });
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const getOwnerName = async (ownerId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${ownerId}`);
      const { data } = response;
      const { name } = data;
      setProduct({ ...product, owner: name });
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  // delete product action
  const onDelete = async () => {
    try {
      // ask the user to confirm the deletion
      if (window.confirm("Are you sure you want to delete this product?")) {
        // send the delete request to the server with token
        // trim the \" from the token
        const trimmedToken = user.replace(/['"]+/g, "");
        const bearerToken = `Bearer ${trimmedToken}`;
        console.log(bearerToken);
        const response = await axios.delete(`${API_URL}/products/${id}`, {
          headers: {
            Authorization: bearerToken,
          },
        });

        // toast a success message while navigating to the home page
        toast.success("Product deleted successfully");
        navigate("/products/mine");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchProductData();
    // getOwnerName();
    // getCategory();
    // decode the token to get the user id

    // if the user is not set, return nothing to avoid errors
    if (!user) return;
    const token = user;
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken._id;
    setUserId(userId);
  }, []);

  return (
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {product.name}
          </h2>
          <p class="mt-1 text-sm text-gray-500">{product.category}</p>
        </div>
        {user && userId === product.owner && (
          <div class="mt-5 flex md:mt-0 md:ml-4">
            <span class="hidden sm:block">
              <Link
                to={`/products/edit/${id}`}
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit product details
              </Link>
            </span>
            <span class="hidden sm:block ml-2">
              <button
                // to={`/products/delete/${product.id}`}
                id="deleteBtn"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white  bg-red-600 hover:bg-red-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={onDelete}
              >
                Delete product
              </button>
            </span>
          </div>
        )}
      </div>
      <div class="mt-4">
        <div class="flex flex-col lg:flex-row">
          <div class="w-full lg:w-1/2">
            <img
              src={product.image}
              alt="Image du produit"
              class="w-full object-center object-contain rounded-lg shadow-md"
            />
          </div>
          <div class="w-full lg:w-1/2 lg:ml-10 mt-4 lg:mt-0">
            <h3 class="text-gray-700 uppercase text-lg font-bold">
              Description
            </h3>
            <p class="mt-2 text-gray-600">{product.description}</p>
            <div class="mt-4">
              <h4 class="text-gray-700 uppercase text-lg font-bold">Price</h4>
              <p class="mt-2 text-gray-600">{product.price} DT</p>
              <h4 class="text-gray-700 uppercase text-lg font-bold mt-4">
                Status
              </h4>
              <p class="mt-2 text-gray-600">{product.status}</p>
              <h4 class="text-gray-700 uppercase text-lg font-bold mt-4">
                Owner phone
              </h4>
              <p class="mt-2 text-gray-600">{product.ownerPhone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
