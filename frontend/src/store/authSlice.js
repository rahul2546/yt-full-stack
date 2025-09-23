import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from '../api/authService';

// Async thunk for logging in user
export const login = createAsyncThunk(
	'auth/login',
	async (Credentials, { rejectWithValue }) => {
		try {
			const data = await loginUser(Credentials);
			return data; // This will be the payload for the fulfilled action
		} catch (error) {
			// the returned value becomes the `action.payload` for the rejected action
			return rejectWithValue(error.message || 'Login failed');
		}
	}
);


const initialState = {
	user: null, // Holds user data object
	isAuthenticated: false, // Boolean to track auth status
	token: null, // JWT token
	loading: false, // To track loading state during async operations
	error: null // To hold error messages
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// loginSuccess: (state, action) => {
		// 	state.user = action.payload; // Set user data on login
		// 	state.isAuthenticated = true;
		// },
		logout: (state) => {
			localStorage.removeItem('token'); // Clear token from localStorage
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
		},
	},

	// Handle async actions using extraReducers
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null; // Clear previous errors
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload;
				state.token = action.payload.token; // Assuming the token is in payload
				localStorage.setItem('token', action.payload.token); // Store token in localStorage 
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Login failed'; // Set error message from rejectWithValue
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
			});
	},
});
export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;