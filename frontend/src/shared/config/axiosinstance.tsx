import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api", // Make sure this matches your backend URL
    withCredentials: true,
});

// Add a request interceptor to include the auth token in all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;