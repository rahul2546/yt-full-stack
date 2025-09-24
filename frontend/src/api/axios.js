import axios from 'axios';

const api = axios.create({
	// Backend URL
	baseURL: 'http://localhost:5000/api/v1'
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