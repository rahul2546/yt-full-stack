import mongoose, { Schema, model } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    subscribedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ subscriber: 1, subscribedTo: 1 }, { unique: true });

export const subscription = model("subscription", subscriptionSchema);
