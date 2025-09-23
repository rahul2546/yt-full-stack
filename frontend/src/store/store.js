// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import the reducer from our auth slice

export const store = configureStore({
  reducer: {
    // We register our slices here
    auth: authReducer,
    // We can add more reducers here later (e.g., for videos, comments)
  },
});