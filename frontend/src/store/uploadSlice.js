// src/store/uploadSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadVideo as uploadVideoService } from '../api/videoService';

// The async thunk for uploading a video
export const uploadVideo = createAsyncThunk(
  'upload/uploadVideo',
  async (videoData, { dispatch, rejectWithValue }) => {
    try {
      // The service function needs a FormData object
      const formData = new FormData();
      // IMPORTANT: Use the exact field names your backend expects
      formData.append('video', videoData.videoFile);
      formData.append('thumbnail', videoData.thumbnailFile);
      formData.append('title', videoData.title);
      formData.append('description', videoData.description);
      // Append tags individually if your backend expects an array
      videoData.tags.forEach(tag => {
        formData.append('tags', tag);
      });

      // The callback function that the service will call to update progress
      const onProgress = (percentCompleted) => {
        dispatch(updateProgress(percentCompleted));
      };

      const newVideo = await uploadVideoService(formData, onProgress);
      return newVideo;
    } catch (error) {
      return rejectWithValue(error.message || 'Upload failed');
    }
  }
);

const initialState = {
  status: 'idle', // 'idle' | 'uploading' | 'success' | 'failed'
  progress: 0,
  error: null,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    // A regular reducer to update the progress
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
    resetUploadState: (state) => {
      state.status = 'idle';
      state.progress = 0;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadVideo.pending, (state) => {
        state.status = 'uploading';
        state.progress = 0;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state) => {
        state.status = 'success';
        state.progress = 100;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { updateProgress, resetUploadState } = uploadSlice.actions;
export default uploadSlice.reducer;