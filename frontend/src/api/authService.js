import api from './axios';

/**
 * @param {object} credentials - The user's credentials.
 * @param {string} credentials.email - The user's email.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<object>} The response data containing user info and token.
 */

export const loginUser = async(credentials) => {
	try{
		const response = await api.post('/auth/login', credentials);
		return response.data; // Assuming the user data and token are in response.data
	} catch (error) {
		console.error('Error logging in:', error.response?.data || error.message);
		throw error; // Re-throw the error for further handling by thunk
	}
};

/**
 * @param {object} userData - the new user's data.
 * @returns {Promise<object>} the new user data and token.
 */

export const registerUser = async (userData) => {
	try{
		const response = await api.post('/auth/register', userData);
		return response.data; // Assuming the user data and token are in response.data
	}catch (error) {
		console.error('Error registering user:', error.response?.data || error.message);
		throw error.response?.data; // Re-throw the error for further handling
	}
};

export const getCurrentUser = async () => {
  try {
    // The token is automatically added by the interceptor
    const response = await api.get('/auth/getProfile');
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};