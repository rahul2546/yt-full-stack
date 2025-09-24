import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, getCurrentUser } from '../api/authService';

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

export const register = createAsyncThunk(
	'auth/register',
	async (userData, { rejectWithValue }) => {
		try {
			const data = await registerUser(userData);
			return data; // This will be the payload for the fulfilled action
		} catch (error) {
			// the returned value becomes the `action.payload` for the rejected action
			return rejectWithValue(error.message || 'Registration failed');
		}	
	}
);

// Thunk to fetch user data if a token exists in localStorage

export const fetchUserOnLoad = createAsyncThunk(
	'auth/fetchUserOnLoad',
	async (_, { rejectWithValue }) => {
		const token = localStorage.getItem('token');
		if (!token) {
			return rejectWithValue('No token found');
		}

		try {
			const data = await getCurrentUser(token);
			// Return user data with token
			return { ...data, token };
		} catch (error) {
			return rejectWithValue(error.message || 'Failed to fetch user');
		}
	}
)


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
			})
			.addCase(register.pending, (state) => {
				state.loading = true;
				state.error = null; // Clear previous errors
			})
			.addCase(register.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload;
				state.token = action.payload.token; // Assuming the token is in payload
				localStorage.setItem('token', action.payload.token); // Store token in localStorage 
			})
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Registration failed'; // Set error message from rejectWithValue
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
			})
			.addCase(fetchUserOnLoad.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload;
				state.token = action.payload.token; // Assuming the token is in payload from localStorage
			})
			.addCase(fetchUserOnLoad.rejected, (state, action) => {
				state.loading = false;
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
				state.error = action.payload || 'Failed to fetch user'; // Set error message from rejectWithValue
				localStorage.removeItem('token'); // Clear invalid token
				console.log('No valid token found or failed to fetch user on load.', action.payload);
			});
	},
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;