// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import the reducer from our auth slice
import videoReducer from './videoSlice';
import uploadReducer from './uploadSlice';
import channelReducer from './channelSlice';

export const store = configureStore({
  reducer: {
    // We register our slices here
    auth: authReducer,
    video: videoReducer,
    upload: uploadReducer,
    channel: channelReducer,
  },
});