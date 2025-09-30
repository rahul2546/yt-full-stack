import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, getCurrentUser } from '../api/authService';
import { toggleSubscription } from '@/api/subscriptionService';
import { fetchVideoById } from './videoSlice';

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

export const toggleChannelSubscription = createAsyncThunk(
	'auth/toggleSubscription',
	async({ channelId, videoId }, { dispatch, rejectWithValue}) =>{
		try {
			await toggleSubscription(channelId);
			// After a successful toggle, re-fetch the user's profile to get the updated list of subscriptions. This keeps our state perfectly in sync.
			await dispatch(fetchUserOnLoad());
			await dispatch(fetchVideoById(videoId));
			return channelId;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
)


const initialState = {
	user: null, // Holds user data object
	isAuthenticated: false, // Boolean to track auth status
	token: null, // JWT token
	loading: false, // To track loading state during async operations
	error: null, // To hold error messages
	subscriptions:[],
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
      // --- THIS IS THE KEY FIX ---
      // This matcher runs for any successful login, register, or session fetch
      .addMatcher(
        (action) => [login.fulfilled.type, register.fulfilled.type, fetchUserOnLoad.fulfilled.type].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.isAuthenticated = true;
          
          // Check if the user data is nested in a 'data' property, which it is for getProfile.
          const userData = action.payload.data ? action.payload.data : action.payload;
          
          state.user = userData;
          state.token = userData.token || action.payload.token; // Get token from wherever it is
          
          // Correctly access the nested subscriptions array
          state.subscriptions = userData.subscriptions || [];
          
          // Ensure token is saved to localStorage
          if (state.token) {
            localStorage.setItem('token', state.token);
          }
        }
      )
      // Handles the pending state for login/register
      .addMatcher(
        (action) => [login.pending.type, register.pending.type].includes(action.type),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Handles any failed auth action
      .addMatcher(
        (action) => [login.rejected.type, register.rejected.type, fetchUserOnLoad.rejected.type].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          state.subscriptions = [];
          localStorage.removeItem('token');
        }
      );
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;