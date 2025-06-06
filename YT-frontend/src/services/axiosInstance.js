import axios from "axios";
import { config } from "dotenv";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_API_URL || 
	"http://localhost:5000/api/v1",
	
	withCredentials: true, // Include credentials for CORS requests cokies, authorization headers, etc.
	
	headers: {
		"Content-Type": "application/json",
	}, // Set default content type for requests
});

// Request Interceptor to add token to headers
axiosInstance.interceptors.request.use((config) =>{
	const token = localStorage.getItem('accessToken');
	if(token){
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		// Handle token expiry, unauthorized request.
		if (error.response && error.response.status === 401) {
			localStorage.removeItem('accessToken');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;