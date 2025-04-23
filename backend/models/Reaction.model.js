import mongoose, { Schema, model } from "mongoose";

const reactionSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    targetType: {
      type: String,
      enum: ["video", "comment"],
      required: true,
    },
    type: {
      type: String,
      enumm: ["like", "dislike"],
      required: true,
    },
  },
  { timestamps: true }
);

reactionSchema.index({ user: 1, targetId: 1, targetType: 1 }, { unique: true });

export const Reaction =  mongoose.models.reaction || model("reaction", reactionSchema);
