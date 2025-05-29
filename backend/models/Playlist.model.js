import e from "express";
import mongoose, { Schema, model } from "mongoose";

const PlaylistScema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        videos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "video",
        },
        ],
    },
    { timestamps: true }
);

export const Playlist = mongoose.models.Playlist || model("Playlist", PlaylistScema);