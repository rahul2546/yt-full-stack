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