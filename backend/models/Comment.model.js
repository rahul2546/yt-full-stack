import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'video',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
    dislikes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref:'user',
      default: [],
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
      },
    ],
  },
  { timestamps: true }
);

export const comment = model("comment", commentSchema);
