import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { getVideoById, toggleLike,toggleDislike } from "@/api/videoService";
import api from "@/api/axios";

// Async thunk to fetch video details by ID

export const fetchVideoById = createAsyncThunk(
	'video/fetchVideoById',
	async (videoId, { rejectWithValue }) => {
		try{
			const videoData = await getVideoById(videoId);
			return videoData;
		}catch(error){
			return rejectWithValue(error.message);
		}
	}
);

// Thunk to toggle a like - now it just calls the service
export const toggleVideoLike = createAsyncThunk(
  'video/toggleLike',
  async (videoId) => {
    return await toggleLike(videoId);
  }
);

// Thunk to toggle a dislike - now it just calls the service
export const toggleVideoDislike = createAsyncThunk(
  'video/toggleDislike',
  async (videoId) => {
    return await toggleDislike(videoId);
  }
);
// -- Slice Definition --

const initialState = {
	currentVideo : null,
	loading : false,
	error : null,
	isLiked : false,
	isDisliked : false,
};

const videoSlice = createSlice({
	name: 'video',
	initialState,
	reducers: {},
	extraReducers : (builder) => {
		builder
		.addCase(fetchVideoById.pending, (state) => {
			 if (!state.currentVideo) {
          state.loading = true;
        }
			state.error = null;
		})
		.addCase(fetchVideoById.fulfilled, (state, action) => {
			state.loading = false;
			state.currentVideo = action.payload;
			// Logic to check if the current user has liked this video will be added here	
		})
		.addCase(fetchVideoById.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase(toggleVideoLike.fulfilled, (state, action) => {
			// when a like is toggled, the API returns the updated video.
			// we replace our current video with the new data.
			state.currentVideo = action.payload;
		})
		.addCase(toggleVideoDislike.fulfilled, (state, action) => {
        state.currentVideo = action.payload;
      });
	},
});

export default videoSlice.reducer;