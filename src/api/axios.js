import axios from "axios";

console.log(process.env.REACT_APP_BACKEND_URL)
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});


export default axiosInstance;