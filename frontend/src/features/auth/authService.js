import axios from "axios";

// get API ENDPOINT from .env file

const API_ENDPOINT = process.env.REACT_APP_API_HOST;
const API_PORT = process.env.REACT_APP_API_PORT;

const API_URL = `${API_ENDPOINT}:${API_PORT}/api/users`;

// Register a new user
const register = async (user) => {
  const response = await axios.post(API_URL, user);
  console.log(response.data.token);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.token));
  }
  return response;
};

// Login in user
const login = async (user) => {
  const response = await axios.post(API_URL + "/login", user);
  console.log(response.data.token);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.token));
  }
  return response;
};

// Logout a user
const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
