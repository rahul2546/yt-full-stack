import axios from 'axios';

let Backend_url

if(import.meta.env.VITE_ENVIRONMENT === 'development'){
	 Backend_url = 'http://localhost:5000/api/v1'
}else{
	Backend_url = https://yt-backend-rt8g.onrender.com
}

const api = axios.create({
	// Backend URL
	
	baseURL: Backend_url
	
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');

	if(token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config; // continue with the request
},
(error) => {
	return Promise.reject(error);
}

);

export default api;