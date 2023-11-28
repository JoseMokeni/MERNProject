import axios from "axios";


const API_URL = "/api/users";

// Register a new user
const register = async (user) => {
    const response = await axios.post(API_URL, user);
    console.log(response.data.token);
    if (response.data){
        localStorage.setItem("user", JSON.stringify(response.data.token));
    }
    return response;
};

const authService = {
    register,
};

export default authService;