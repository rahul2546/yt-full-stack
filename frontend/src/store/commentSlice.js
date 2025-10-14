// src/store/commentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCommentsByVideoId, toggleCommentLike, toggleCommentDislike } from '@/api/CommentService';

// Thunks for fetching and interacting with comments
export const fetchComments = createAsyncThunk('comments/fetchComments', async (videoId) => {
  return await getCommentsByVideoId(videoId);
});

export const likeComment = createAsyncThunk('comments/likeComment', async ({ videoId, commentId }) => {
  return await toggleCommentLike(videoId, commentId);
});

export const dislikeComment = createAsyncThunk('comments/dislikeComment', async ({ videoId, commentId }) => {
  return await toggleCommentDislike(videoId, commentId);
});

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetching comments
      .addCase(fetchComments.pending, (state) => { state.loading = true; })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Liking/Disliking comments
      .addMatcher(
        (action) => [likeComment.fulfilled.type, dislikeComment.fulfilled.type].includes(action.type),
        (state, action) => {
          // Find the index of the updated comment
          const index = state.comments.findIndex(c => c._id === action.payload._id);
          if (index !== -1) {
            // Replace the old comment with the updated one from the API
            state.comments[index] = action.payload;
          }
          // Note: This logic only works for top-level comments. Updating nested replies is more complex.
        }
      );
  },
});

export default commentSlice.reducer;