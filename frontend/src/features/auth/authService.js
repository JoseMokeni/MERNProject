import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

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
