// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js'; // Import the reducer from our auth slice
import videoReducer from './videoSlice.js';
import uploadReducer from './uploadSlice.js';
import channelReducer from './channelSlice.js';
import commentReducer from './commentSlice.js'; 

export const store = configureStore({
  reducer: {
    // We register our slices here
    auth: authReducer,
    video: videoReducer,
    upload: uploadReducer,
    channel: channelReducer,
    comments: commentReducer,
  },
});