import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          // regex for email validation
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (password) {
      //     // At least 8 characters, one uppercase, one lowercase, one number, one special character
      //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(
      //       password
      //     );
      //   },
      //   message: () =>
      //     `Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.`,
      // },
    },
    profileImg: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("user", userSchema);
