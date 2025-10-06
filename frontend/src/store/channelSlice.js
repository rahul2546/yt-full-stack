// src/store/channelSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getChannelProfile } from '../api/channelService';
import { toggleChannelSubscription } from './authSlice'; // Import the action we want to listen to

export const fetchChannelById = createAsyncThunk(
  'channel/fetchById',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await getChannelProfile(channelId);
      return response.channel;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  channelData: null,
  loading: false,
  error: null,
};

const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannelById.fulfilled, (state, action) => {
        state.loading = false;
        state.channelData = action.payload;
      })
      .addCase(fetchChannelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // This is the key: Listen for the other slice's action
      .addCase(toggleChannelSubscription.fulfilled, (state, action) => {
        // When a subscription is toggled, increment/decrement the count locally
        // This is an "optimistic update" and feels instant
        if (state.channelData) {
          const isSubscribed = action.payload.isSubscribed; // Assuming the thunk returns this
          state.channelData.subscriberCount += isSubscribed ? 1 : -1;
        }
      });
  },
});

export default channelSlice.reducer;