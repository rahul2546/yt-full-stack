import React from 'react'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '@/services/axiosInstance'

export const loginUser = createAsyncThunk(
	'auth/login',

	async (data, thunkAPI) => {

		try {
			const response = await axios.post('/auth/login', data);
			localStorage.setItem('accessToken', response.data.data.accessToken);

			return response.data.data;

		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data.message);

		}
	}
);

export const registerUser = createAsyncThunk(
	'auth/register',
	async (data, thunkAPI) => {
		try {
			const response = await axios.post('/auth/register', data);
			localStorage.setItem('accessToken', response.data.data.accessToken);

			return response.data.data;

		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data.message);
		}
	}
);

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		isAuthenticated: false,
		loading: false,
		error: null
	},
	reducers: {
		logout: (state) => {
			localStorage.removeItem('accessToken');
			state.user = null;
			state.isAuthenticated = false;
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state,
				action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
			
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;